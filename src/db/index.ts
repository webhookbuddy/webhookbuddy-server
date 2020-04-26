import { Pool, QueryConfig } from 'pg';

const pool = new Pool({
  database: process.env.DATABASE,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10),
});

export default {
  query: (text: string | QueryConfig<any>, params?: Array<any>) =>
    pool.query(text, params),
};
