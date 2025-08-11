import { describe, it, expect } from 'vitest';
import { pickBucket, histogram } from '@/lib/chart-helpers';

describe('pickBucket', () => {
  it('picks day for <=31 days', () => {
    expect(pickBucket('2025-01-01','2025-01-31')).toBe('day');
  });
  it('picks week for <=120 days', () => {
    expect(pickBucket('2025-01-01','2025-04-30')).toBe('week');
  });
  it('picks month for >120 days', () => {
    expect(pickBucket('2025-01-01','2025-08-10')).toBe('month');
  });
});

describe('histogram', () => {
  it('bins values', () => {
    const res = histogram([1,2,3,10,11,12], 3);
    expect(res.counts.reduce((a,b)=>a+b,0)).toBe(6);
    expect(res.edges.length).toBe(4);
  });
});
