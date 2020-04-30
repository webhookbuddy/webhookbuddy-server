import { Pool, QueryConfig } from 'pg';

export const pool = new Pool({
  database: process.env.DATABASE,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10),
});

export const query = (
  text: string | QueryConfig<any>,
  params?: Array<any>,
) => pool.query(text, params);

export const many = async (
  text: string | QueryConfig<any>,
  params?: Array<any>,
) => {
  const { rows } = await query(text, params);
  return rows;
};

export const any = async (
  text: string | QueryConfig<any>,
  params?: Array<any>,
) => (await many(text, params)).length > 0;

export const first = async (
  text: string | QueryConfig<any>,
  params?: Array<any>,
) => {
  const rows = await many(text, params);
  if (rows.length) return rows[0];
  else return null;
};

export const single = async (
  text: string | QueryConfig<any>,
  params?: Array<any>,
) => {
  const rows = await many(text, params);
  if (!rows.length) return null;
  if (rows.length === 1) return rows[0];
  else throw new Error('Multiple rows found.');
};
