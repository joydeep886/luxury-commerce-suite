
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../models/schema';

const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/luxuria';

const sql = postgres(connectionString);
export const db = drizzle(sql, { schema });

export default db;
