import { z } from 'zod';

export type Company = 'OMAN_OIL' | 'NAMA';
export type RefType = 'WO' | 'WNSC';
export type WOStatus = 'Open' | 'WaitForApproval' | 'Approved' | 'Completed';

export interface RecordModel {
  id: string;
  company: Company;
  refType: RefType;
  refNumber: string;
  status?: WOStatus;
  description?: string;
  startDate?: string; // ISO
  endDate?: string;   // ISO
  date?: string;      // ISO for WO
  durationDays?: number;
  photosBefore?: string[]; // blob keys/urls
  photosAfter?: string[];
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export const baseSchema = z.object({
  id: z.string(),
  company: z.enum(['OMAN_OIL', 'NAMA']),
  refType: z.enum(['WO', 'WNSC']),
  refNumber: z.string().min(1, 'Reference number is required'),
  description: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  date: z.string().optional(),
  durationDays: z.number().optional(),
  photosBefore: z.array(z.string()).optional(),
  photosAfter: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  status: z.enum(['Open', 'WaitForApproval', 'Approved', 'Completed']).optional(),
});

export const validateWO = (r: RecordModel): { ok: true } | { ok: false; error: string } => {
  const base = baseSchema.safeParse(r);
  if (!base.success) return { ok: false, error: base.error.errors.map(e => e.message).join(', ') };
  if (r.refType !== 'WO') return { ok: false, error: 'Invalid refType for WO' };
  if (!r.date) return { ok: false, error: 'WO requires date' };
  if (!r.status || !['Open','WaitForApproval','Approved','Completed'].includes(r.status)) {
    return { ok: false, error: 'WO status must be one of Open|WaitForApproval|Approved|Completed' };
  }
  return { ok: true };
};

export const validateWNSC = (r: RecordModel): { ok: true } | { ok: false; error: string } => {
  const base = baseSchema.safeParse(r);
  if (!base.success) return { ok: false, error: base.error.errors.map(e => e.message).join(', ') };
  if (r.refType !== 'WNSC') return { ok: false, error: 'Invalid refType for WNSC' };
  if (!r.startDate) return { ok: false, error: 'WNSC requires startDate' };
  if (r.endDate && new Date(r.endDate).getTime() < new Date(r.startDate).getTime()) {
    return { ok: false, error: 'endDate must be >= startDate' };
  }
  return { ok: true };
};

export const computeDurationDays = (startISO: string, endISO: string): number => {
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  const start = new Date(startISO);
  const end = new Date(endISO);
  const diff = end.getTime() - start.getTime();
  if (diff < 0) return 0;
  return Math.ceil(diff / MS_PER_DAY);
};
