import { describe, it, expect } from 'vitest';
import { validateWO, validateWNSC, computeDurationDays, type RecordModel } from '@/lib/validators';

const now = new Date().toISOString();

describe('validators', () => {
  it('valid WO', () => {
    const r: RecordModel = {
      id: '1', company: 'OMAN_OIL', refType: 'WO', refNumber: 'WO-1',
      status: 'Open', date: '2025-08-10', createdAt: now, updatedAt: now
    };
    expect(validateWO(r).ok).toBe(true);
  });
  it('invalid WO status', () => {
    const r: any = { id:'1', company:'OMAN_OIL', refType:'WO', refNumber:'x', date:'2025-08-10', createdAt:now, updatedAt:now, status:'Bad' };
    expect(validateWO(r).ok).toBe(false);
  });
  it('duration calc uses ceil', () => {
    const d = computeDurationDays('2025-08-01T00:00:00Z','2025-08-02T01:00:00Z');
    expect(d).toBe(2);
  });
  it('valid WNSC', () => {
    const r: RecordModel = {
      id: '2', company: 'NAMA', refType: 'WNSC', refNumber: 'W-1',
      startDate: '2025-08-01', endDate: '2025-08-03', createdAt: now, updatedAt: now
    };
    expect(validateWNSC(r).ok).toBe(true);
  });
});
