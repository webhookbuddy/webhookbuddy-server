import { createDb, migrate } from 'postgres-migrations';
import { pool } from './index';

// https://github.com/ThomWright/postgres-migrations
// TODO: get a code review by a seasoned node developer about connect and release of pool here
export const migrateDB = async () => {
  const client = await pool.connect();
  try {
    await createDb(process.env.DATABASE, { client });
    await migrate({ client }, 'src/migrations');
  } finally {
    client.release();
  }
};
