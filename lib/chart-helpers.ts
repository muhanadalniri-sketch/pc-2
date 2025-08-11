import { DateTime, Interval } from 'luxon';
import { TOKENS } from './tokens';
import type { RecordModel } from './validators';

export type Bucket = 'day' | 'week' | 'month';

export const pickBucket = (startISO: string, endISO: string): Bucket => {
  const start = DateTime.fromISO(startISO, { zone: TOKENS.tz });
  const end = DateTime.fromISO(endISO, { zone: TOKENS.tz });
  const days = Math.max(1, Math.round(end.diff(start, 'days').days));
  if (days <= 31) return 'day';
  if (days <= 120) return 'week';
  return 'month';
};

export const rangeBuckets = (startISO: string, endISO: string, bucket: Bucket): string[] => {
  let cursor = DateTime.fromISO(startISO, { zone: TOKENS.tz }).startOf(bucket);
  const end = DateTime.fromISO(endISO, { zone: TOKENS.tz }).endOf(bucket);
  const buckets: string[] = [];
  while (cursor <= end) {
    buckets.push(cursor.toISO());
    cursor = cursor.plus({ [bucket]: 1 }).startOf(bucket);
  }
  return buckets;
};

export const labelFor = (iso: string, bucket: Bucket): string => {
  const dt = DateTime.fromISO(iso, { zone: TOKENS.tz });
  if (bucket === 'day') return dt.toFormat('dd LLL');
  if (bucket === 'week') return `W${dt.weekNumber} ${dt.toFormat('yyyy')}`;
  return dt.toFormat('LLL yyyy');
};

export const aggregateCompleted = (records: RecordModel[], startISO: string, endISO: string, companyFilter: 'ALL' | 'OMAN_OIL' | 'NAMA') => {
  const bucket = pickBucket(startISO, endISO);
  const bucketStarts = rangeBuckets(startISO, endISO, bucket);
  const buckets = bucketStarts.map(b => ({ key: b, label: labelFor(b, bucket), wo: 0, wnsc: 0 }));

  const inRange = (iso: string | undefined) => {
    if (!iso) return false;
    const d = DateTime.fromISO(iso, { zone: TOKENS.tz });
    const start = DateTime.fromISO(startISO, { zone: TOKENS.tz }).startOf('day');
    const end = DateTime.fromISO(endISO, { zone: TOKENS.tz }).endOf('day');
    return Interval.fromDateTimes(start, end).contains(d);
  };

  for (const r of records) {
    if (companyFilter !== 'ALL' && r.company !== companyFilter) continue;
    if (r.refType === 'WO') {
      if (r.status === 'Completed' && inRange(r.date)) {
        const key = DateTime.fromISO(r.date!, { zone: TOKENS.tz }).startOf(bucket).toISO();
        const b = buckets.find(bb => bb.key === key);
        if (b) b.wo += 1;
      }
    } else if (r.refType === 'WNSC') {
      // Completed when endDate exists
      if (r.endDate && inRange(r.endDate)) {
        const key = DateTime.fromISO(r.endDate!, { zone: TOKENS.tz }).startOf(bucket).toISO();
        const b = buckets.find(bb => bb.key === key);
        if (b) b.wnsc += 1;
      }
    }
  }
  return { bucket, points: buckets };
};

export const histogram = (values: number[], bins: number) => {
  if (values.length === 0) return { edges: [0, 1], counts: [0] };
  const min = Math.min(...values);
  const max = Math.max(...values);
  const width = Math.max(1, Math.ceil((max - min + 1) / bins));
  const edges = Array.from({length: bins+1}, (_, i) => min + i * width);
  const counts = new Array(bins).fill(0);
  for (const v of values) {
    let idx = Math.floor((v - min) / width);
    if (idx >= bins) idx = bins - 1;
    if (idx < 0) idx = 0;
    counts[idx] += 1;
  }
  return { edges, counts };
};
