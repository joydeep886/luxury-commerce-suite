import type { Config } from 'drizzle-kit';

export default {
  schema: './src/models/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/luxuria',
  },
} satisfies Config;


// import { defineConfig } from "drizzle-kit";
// export default defineConfig({
//   dialect: "postgresql",
//   out: './drizzle',
//   schema: "./src/models/schema.ts"
// });
