export const TOKENS = {
  useSemanticStatusColors: true,
  radii: { card: 'var(--radius)' },
  gradients: {
    omanOil: ['var(--oo-from)', 'var(--oo-to)'],
    nama: ['var(--na-from)', 'var(--na-to)'],
  },
  status: {
    open: 'var(--status-open)',
    wait: 'var(--status-wait)',
    approved: 'var(--status-approved)',
    completed: 'var(--status-completed)',
  },
  a11y: { contrastMinRatio: 4.5 },
  tz: 'Asia/Muscat',
} as const;
