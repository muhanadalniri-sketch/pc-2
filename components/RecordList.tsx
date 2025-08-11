'use client';
import React from 'react';
import { db } from '@/lib/db/dexie';
import StatusChip from './StatusChip';

export default function RecordList() {
  const [rows, setRows] = React.useState<any[]>([]);

  const refresh = async () => {
    const r = await db.records.toArray();
    setRows(r.sort((a,b) => (b.updatedAt).localeCompare(a.updatedAt)));
  };
  React.useEffect(() => {
    refresh();
  }, []);

  return (
    <div className="bevel p-4 overflow-auto">
      <table className="w-full text-sm">
        <thead className="text-left border-b border-slate-200 dark:border-slate-700">
          <tr>
            <th className="py-2">Company</th>
            <th>Type</th>
            <th>Ref</th>
            <th>Status</th>
            <th>Date/Start</th>
            <th>End</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id} className="border-b border-slate-100/50 dark:border-slate-800/50">
              <td className="py-2">{r.company}</td>
              <td>{r.refType}</td>
              <td className="font-mono">{r.refNumber}</td>
              <td>{r.refType === 'WO' ? <StatusChip status={r.status} /> : (r.endDate ? 'Completed' : 'Open')}</td>
              <td>{r.date || r.startDate || ''}</td>
              <td>{r.endDate || ''}</td>
              <td>{r.durationDays ?? ''}</td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr><td className="py-3 text-slate-500" colSpan={7}>No records yet</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
