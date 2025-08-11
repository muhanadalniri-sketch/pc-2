import React from 'react';

export default function KpiCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="bevel p-4">
      <div className="text-sm text-slate-500 dark:text-slate-400">{title}</div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
    </div>
  );
}
