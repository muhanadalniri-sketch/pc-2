# Field Summary Dashboard (PWA)

**Next.js + TypeScript + Tailwind** single-user PWA that works **fully offline after the first online visit**.
Tracks **Oman Oil (WO)** and **NAMA (WNSC)** records with a **Summary Dashboard**, gradient charts, and exports.

## Features
- **Offline-first** via `next-pwa`/Workbox (App Router). App Shell precached, runtime caches for fonts/images, fallback `/offline`.
- **IndexedDB (Dexie)** storage; photos compressed client-side and stored as blobs.
- **Charts** (Chart.js) with gradients; respects `prefers-reduced-motion`.
- **KPI cards**, **Completed Over Time**, **WO Status Breakdown**, **WNSC Duration Histogram**.
- **Exports**: CSV, PNG (snapshot), Monthly PDF (summary).
- **Themes**: Oman Oil (blue), NAMA (red). Concave "press" buttons with inner shadow.
- **Timezone**: Aggregations use **Asia/Muscat** via Luxon helpers.

## Data Model
```ts
type RecordModel = {
  id: string;
  company: 'OMAN_OIL'|'NAMA';
  refType: 'WO'|'WNSC';
  refNumber: string;
  status?: 'Open'|'WaitForApproval'|'Approved'|'Completed';
  description?: string;
  startDate?: string; endDate?: string; date?: string;
  durationDays?: number;
  photosBefore?: string[]; photosAfter?: string[];
  tags?: string[]; createdAt: string; updatedAt: string;
}
```

## Bucketing Rules
- Range ≤ 31 days ⇒ **day**
- Range ≤ 120 days ⇒ **week**
- Else ⇒ **month**

## Getting Started (Local)
```bash
pnpm i   # or npm i / yarn
pnpm dev # open http://localhost:3000
```

## Deploy (GitHub → Vercel)
1. Push this repo to GitHub.
2. Import the repo into Vercel.
3. Build + deploy with defaults. PWA is auto-enabled in production.

## A2HS (Add to Home Screen)
- Visit the app in Safari (iOS) or Chrome (Android), Share → **Add to Home Screen**.
- First visit must be **online** (to install SW). After that, it works offline.

## Notes
- iOS meta/icons included (apple-touch-icon). Images are placeholders; replace with your branding.
- Lighthouse PWA score ≥ 90 depending on hosting config. Serve over HTTPS.
