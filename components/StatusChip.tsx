import React from 'react';
import { TOKENS } from '@/lib/tokens';

export default function StatusChip({ status }: { status: 'Open'|'WaitForApproval'|'Approved'|'Completed' }) {
  const color = TOKENS.useSemanticStatusColors ? (
    status === 'Open' ? 'var(--status-open)' :
    status === 'WaitForApproval' ? 'var(--status-wait)' :
    status === 'Approved' ? 'var(--status-approved)' :
    'var(--status-completed)'
  ) : 'var(--accent-from)';

  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ background: color, color: 'white' }}
      aria-label={`Status: ${status}`}
    >
      {status}
    </span>
  );
}
