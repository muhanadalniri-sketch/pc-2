import Dexie, { Table } from 'dexie';
import type { RecordModel } from '../validators';

export class AppDB extends Dexie {
  records!: Table<RecordModel, string>;
  blobs!: Table<{ id: string; blob: Blob }, string>;

  constructor() {
    super('pwa-dashboard-db');
    this.version(1).stores({
      records: 'id, company, refType, refNumber, date, startDate, endDate, status, createdAt, updatedAt',
      blobs: 'id'
    });
  }
}

export const db = new AppDB();

export const saveBlob = async (blob: Blob): Promise<string> => {
  const id = crypto.randomUUID();
  await db.blobs.put({ id, blob });
  return id;
};

export const getBlobUrl = async (id: string): Promise<string> => {
  const row = await db.blobs.get(id);
  if (!row) throw new Error('Blob not found');
  return URL.createObjectURL(row.blob);
};
