import config from 'config';
import { Pool, QueryConfig } from 'pg';

export const pool = config.database.url
  ? new Pool({ connectionString: config.database.url })
  : new Pool({
      database: config.database.name,
      user: config.database.user,
      password: config.database.password,
      host: config.database.host,
      port: config.database.port,
    });

export const query = (
  text: string | QueryConfig<any>,
  params?: Array<any>,
) => pool.query(text, params);

export const transaction = (
  text: string | QueryConfig<any>,
  params?: Array<any>,
) => {
  try {
    pool.query('BEGIN');
    const result = pool.query(text, params);
    pool.query('COMMIT');
    return result;
  } catch (error) {
    pool.query('ROLLBACK');
    throw error;
  }
};

export const many = async (
  text: string | QueryConfig<any>,
  params?: Array<any>,
) => {
  const { rows } = await query(text, params);
  return rows;
};

export const transactionMany = async (
  text: string | QueryConfig<any>,
  params?: Array<any>,
) => {
  const { rows } = await transaction(text, params);
  return rows;
};

export const first = async (
  text: string | QueryConfig<any>,
  params?: Array<any>,
) => {
  const rows = await many(text, params);
  return rows.length ? rows[0] : null;
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

export const transactionSingle = async (
  text: string | QueryConfig<any>,
  params?: Array<any>,
) => {
  const rows = await transactionMany(text, params);
  if (!rows.length) return null;
  if (rows.length === 1) return rows[0];
  else throw new Error('Multiple rows found.');
};

export const any = async (
  text: string | QueryConfig<any>,
  params?: Array<any>,
) => (await many(text, params)).length > 0;
