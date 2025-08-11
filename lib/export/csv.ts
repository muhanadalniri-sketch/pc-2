import type { RecordModel } from '../validators';

const escapeCell = (s: string) => {
  if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
  return s;
};

export const exportRecordsToCSV = (rows: RecordModel[]) => {
  const headers = ['id','company','refType','refNumber','status','description','startDate','endDate','date','durationDays','tags','createdAt','updatedAt'];
  const data = [headers.join(',')].concat(
    rows.map(r => [
      r.id, r.company, r.refType, r.refNumber, r.status ?? '',
      r.description ?? '', r.startDate ?? '', r.endDate ?? '', r.date ?? '',
      (r.durationDays ?? '').toString(),
      (r.tags ?? []).join('|'),
      r.createdAt, r.updatedAt
    ].map(x => escapeCell(String(x))).join(','))
  ).join('\n');

  const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'records.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};
