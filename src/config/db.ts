import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const envFile = process.env.NODE_ENV === 'docker' ? '.env.docker' : '.env.local';
dotenv.config({ path: envFile });

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

export const query = (text: string, params?: any[]) => pool.query(text, params);

export default pool;
