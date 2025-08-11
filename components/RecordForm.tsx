'use client';
import React from 'react';
import { db, saveBlob } from '@/lib/db/dexie';
import { computeDurationDays, validateWO, validateWNSC, type RecordModel } from '@/lib/validators';
import ConcaveBevelButton from './ConcaveBevelButton';

const compressImage = (file: File, maxW = 1600): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, maxW / img.width);
      const canvas = document.createElement('canvas');
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(b => {
        if (!b) return reject(new Error('Compression failed'));
        resolve(b);
        URL.revokeObjectURL(url);
      }, 'image/webp', 0.8);
    };
    img.onerror = reject;
    img.src = url;
  });
};

type Props = { mode: 'WO'|'WNSC' };

export default function RecordForm({ mode }: Props) {
  const [state, setState] = React.useState<any>({ status: 'Open' });
  const [busy, setBusy] = React.useState(false);

  const onPhotoInput = async (e: React.ChangeEvent<HTMLInputElement>, key: 'photosBefore'|'photosAfter') => {
    const files = e.target.files;
    if (!files) return;
    const ids: string[] = [];
    for (const f of Array.from(files)) {
      const blob = await compressImage(f);
      const id = await saveBlob(blob);
      ids.push(id);
    }
    setState((s: any) => ({ ...s, [key]: [...(s[key] || []), ...ids] }));
  };

  const save = async () => {
    setBusy(true);
    const now = new Date().toISOString();
    const record: RecordModel = {
      id: crypto.randomUUID(),
      company: mode === 'WO' ? 'OMAN_OIL' : 'NAMA',
      refType: mode,
      refNumber: (state.refNumber || '').trim(),
      description: state.description || undefined,
      date: mode === 'WO' ? state.date : undefined,
      status: mode === 'WO' ? state.status : undefined,
      startDate: mode === 'WNSC' ? state.startDate : undefined,
      endDate: mode === 'WNSC' ? state.endDate : undefined,
      durationDays: undefined,
      photosBefore: state.photosBefore || [],
      photosAfter: state.photosAfter || [],
      tags: [],
      createdAt: now,
      updatedAt: now,
    };

    if (mode === 'WNSC' && record.startDate && record.endDate) {
      record.durationDays = computeDurationDays(record.startDate, record.endDate);
    }

    const v = mode === 'WO' ? validateWO(record) : validateWNSC(record);
    if (!v.ok) {
      alert(v.error);
      setBusy(false);
      return;
    }

    await db.records.put(record);
    setBusy(false);
    setState({ status: 'Open' });
    alert('Saved');
  };

  return (
    <div className="bevel p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Reference Number *</label>
          <input className="mt-1 w-full rounded-lg px-3 py-2 bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700"
            value={state.refNumber || ''} onChange={e => setState({...state, refNumber: e.target.value})} />
        </div>
        {mode === 'WO' ? (
          <div>
            <label className="block text-sm font-medium">Date *</label>
            <input type="date" className="mt-1 w-full rounded-lg px-3 py-2 bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700"
              value={state.date || ''} onChange={e => setState({...state, date: e.target.value})} />
          </div>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium">Start Date *</label>
              <input type="date" className="mt-1 w-full rounded-lg px-3 py-2 bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700"
                value={state.startDate || ''} onChange={e => setState({...state, startDate: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium">End Date</label>
              <input type="date" className="mt-1 w-full rounded-lg px-3 py-2 bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700"
                value={state.endDate || ''} onChange={e => setState({...state, endDate: e.target.value})} />
            </div>
          </>
        )}
        {mode === 'WO' && (
          <div>
            <label className="block text-sm font-medium">Status *</label>
            <select className="mt-1 w-full rounded-lg px-3 py-2 bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700"
              value={state.status} onChange={e => setState({...state, status: e.target.value})}>
              <option>Open</option>
              <option>WaitForApproval</option>
              <option>Approved</option>
              <option>Completed</option>
            </select>
          </div>
        )}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium">Description</label>
          <textarea className="mt-1 w-full rounded-lg px-3 py-2 bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700"
            value={state.description || ''} onChange={e => setState({...state, description: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium">Photos (Before)</label>
          <input type="file" accept="image/*" multiple onChange={e => onPhotoInput(e, 'photosBefore')} />
        </div>
        <div>
          <label className="block text-sm font-medium">Photos (After)</label>
          <input type="file" accept="image/*" multiple onChange={e => onPhotoInput(e, 'photosAfter')} />
        </div>
      </div>

      <ConcaveBevelButton onClick={save} disabled={busy}>
        {busy ? 'Saving...' : 'Save'}
      </ConcaveBevelButton>
    </div>
  );
}
