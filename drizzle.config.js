import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config(); // load .env

export default defineConfig({
  schema: './src/modules/**/*.schema.js',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});