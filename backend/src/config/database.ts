
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../models/schema';
import dotenv from 'dotenv';
dotenv.config();

console.log(process.env.DATABASE_URL);
const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/luxuria';

const sql = postgres(connectionString);
export const db = drizzle(sql, { schema });


export default db;
