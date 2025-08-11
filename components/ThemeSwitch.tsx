'use client';
import React from 'react';

export default function ThemeSwitch() {
  const [theme, setTheme] = React.useState<'oman'|'nama'>('oman');
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme === 'oman' ? 'oman' : 'nama');
  }, [theme]);

  return (
    <div className="inline-flex items-center gap-2">
      <button className={`px-3 py-1 rounded-full text-sm ${theme==='oman'?'accent-gradient text-white':'bg-white/40 dark:bg-slate-800/40'}`} onClick={() => setTheme('oman')}>Oman Oil</button>
      <button className={`px-3 py-1 rounded-full text-sm ${theme==='nama'?'accent-gradient text-white':'bg-white/40 dark:bg-slate-800/40'}`} onClick={() => setTheme('nama')}>NAMA</button>
    </div>
  );
}
