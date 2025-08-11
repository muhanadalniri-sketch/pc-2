'use client';
import React from 'react';
import { DateTime } from 'luxon';
import { db } from '@/lib/db/dexie';
import KpiCard from '@/components/KpiCard';
import ChartCompletedOverTime from '@/components/ChartCompletedOverTime';
import ChartStatusBreakdown from '@/components/ChartStatusBreakdown';
import ChartWnscDurations from '@/components/ChartWnscDurations';
import { aggregateCompleted, histogram } from '@/lib/chart-helpers';
import { exportElementToPNG } from '@/lib/export/png';
import { exportRecordsToCSV } from '@/lib/export/csv';
import { exportMonthlyPDF } from '@/lib/export/pdf';

export default function DashboardPage() {
  const [from, setFrom] = React.useState(DateTime.now().minus({ days: 30 }).toISODate()!);
  const [to, setTo] = React.useState(DateTime.now().toISODate()!);
  const [companyFilter, setCompanyFilter] = React.useState<'ALL'|'OMAN_OIL'|'NAMA'>('ALL');
  const [statusFilter, setStatusFilter] = React.useState<'ALL'|'Open'|'WaitForApproval'|'Approved'|'Completed'>('ALL');
  const [search, setSearch] = React.useState('');
  const [records, setRecords] = React.useState<any[]>([]);
  const [dashboardRef, setDashboardRef] = React.useState<HTMLDivElement | null>(null);
  const [bins, setBins] = React.useState(10);

  const refresh = async () => {
    let rows = await db.records.toArray();
    if (companyFilter !== 'ALL') rows = rows.filter(r => r.company === companyFilter);
    if (statusFilter !== 'ALL') rows = rows.filter(r => (r.refType === 'WO' ? r.status === statusFilter : (statusFilter === 'Completed' ? r.endDate : !r.endDate)));
    if (search.trim()) rows = rows.filter(r => JSON.stringify(r).toLowerCase().includes(search.toLowerCase()));
    setRecords(rows);
  };

  React.useEffect(() => { refresh(); }, [companyFilter, statusFilter, search, from, to]);

  const startISO = DateTime.fromISO(from).startOf('day').toISO()!;
  const endISO = DateTime.fromISO(to).endOf('day').toISO()!;
  const completedAgg = aggregateCompleted(records, startISO, endISO, companyFilter);
  const woCounts = records.filter(r => r.refType === 'WO').reduce((acc, r) => {
    acc[r.status || 'Open'] = (acc[r.status || 'Open'] || 0) + 1;
    return acc;
  }, { Open:0, WaitForApproval:0, Approved:0, Completed:0 } as any);

  const wnscDurations = records.filter(r => r.refType === 'WNSC' && (r.durationDays ?? 0) > 0).map(r => r.durationDays as number);
  const hist = histogram(wnscDurations, bins);

  const kpiTotal = records.length;
  const kpiWoCompleted = records.filter(r => r.refType==='WO' && r.status==='Completed').length;
  const kpiWnscCompleted = records.filter(r => r.refType==='WNSC' && r.endDate).length;
  const avgDuration = wnscDurations.length ? Math.round(wnscDurations.reduce((a,b)=>a+b,0) / wnscDurations.length) : 0;

  const exportPng = () => { if (dashboardRef) exportElementToPNG(dashboardRef); };
  const exportCsv = () => exportRecordsToCSV(records);
  const exportPdf = async () => {
    // Group by month label for PDF
    const byMonth = new Map<string, { wo: number; wnsc: number; durations: number[] }>();
    for (const r of records) {
      const dISO = r.refType==='WO' ? r.date : r.endDate;
      if (!dISO) continue;
      const dt = DateTime.fromISO(dISO).toFormat('LLL yyyy');
      const v = byMonth.get(dt) || { wo: 0, wnsc: 0, durations: [] };
      if (r.refType==='WO' && r.status==='Completed') v.wo++;
      if (r.refType==='WNSC' && r.endDate) { v.wnsc++; if (r.durationDays) v.durations.push(r.durationDays); }
      byMonth.set(dt, v);
    }
    const summaries = Array.from(byMonth.entries()).map(([monthLabel, v]) => ({
      monthLabel,
      woCompleted: v.wo,
      wnscCompleted: v.wnsc,
      avgWnscDuration: v.durations.length? Math.round(v.durations.reduce((a,b)=>a+b,0)/v.durations.length):0
    }));
    await exportMonthlyPDF(summaries);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-sm">Company</label>
          <select className="rounded-lg px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60"
            value={companyFilter} onChange={e => setCompanyFilter(e.target.value as any)}>
            <option value="ALL">All</option>
            <option value="OMAN_OIL">Oman Oil</option>
            <option value="NAMA">NAMA</option>
          </select>
        </div>
        <div>
          <label className="block text-sm">Status</label>
          <select className="rounded-lg px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60"
            value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)}>
            <option>ALL</option>
            <option>Open</option>
            <option>WaitForApproval</option>
            <option>Approved</option>
            <option>Completed</option>
          </select>
        </div>
        <div>
          <label className="block text-sm">From</label>
          <input type="date" value={from} onChange={e=>setFrom(e.target.value)} className="rounded-lg px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60" />
        </div>
        <div>
          <label className="block text-sm">To</label>
          <input type="date" value={to} onChange={e=>setTo(e.target.value)} className="rounded-lg px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60" />
        </div>
        <div className="grow">
          <label className="block text-sm">Search</label>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search text..." className="w-full rounded-lg px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60"/>
        </div>
        <div className="flex items-end gap-2">
          <button onClick={exportCsv} className="px-3 py-2 rounded-lg bg-white/60 dark:bg-slate-800/60 border">Export CSV</button>
          <button onClick={exportPng} className="px-3 py-2 rounded-lg bg-white/60 dark:bg-slate-800/60 border">Export PNG</button>
          <button onClick={exportPdf} className="px-3 py-2 rounded-lg bg-white/60 dark:bg-slate-800/60 border">Export PDF</button>
        </div>
      </div>

      <div ref={setDashboardRef} className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiCard title="Total Records" value={kpiTotal} />
          <KpiCard title="WO Completed" value={kpiWoCompleted} />
          <KpiCard title="WNSC Completed" value={kpiWnscCompleted} />
          <KpiCard title="Avg WNSC Duration (days)" value={avgDuration} />
        </div>

        <div className="bevel p-4 micro-ripple">
          <div className="mb-2 font-semibold">Completed Over Time</div>
          <ChartCompletedOverTime
            data={completedAgg.points.map(p => ({ label: p.label, wo: p.wo, wnsc: p.wnsc }))}
            showBoth={companyFilter === 'ALL'}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bevel p-4">
            <div className="mb-2 font-semibold">WO Status Breakdown</div>
            <ChartStatusBreakdown counts={woCounts} />
          </div>
          <div className="bevel p-4 micro-drip">
            <div className="mb-2 font-semibold flex items-center gap-2">
              <span>WNSC Duration Distribution</span>
              <input type="range" min={5} max={30} value={bins} onChange={e=>setBins(parseInt(e.target.value))} />
              <span className="text-xs">bins: {bins}</span>
            </div>
            <ChartWnscDurations edges={hist.edges} counts={hist.counts} />
          </div>
        </div>
      </div>
    </div>
  );
}
