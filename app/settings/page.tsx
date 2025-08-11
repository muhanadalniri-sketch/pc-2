'use client';
import React from 'react';
export default function SettingsPage() {
  const [useSemantic, setUseSemantic] = React.useState(true);
  return (
    <div className="space-y-4">
      <div className="bevel p-4">
        <div className="font-semibold mb-2">Status Colors</div>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={useSemantic} onChange={e=>setUseSemantic(e.target.checked)} />
          <span>Use semantic status colors</span>
        </label>
        <p className="text-sm text-slate-500 mt-2">Note: Toggle is local to this session (demo). Persisting settings can be added later.</p>
      </div>
    </div>
  );
}
