import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { users } from './modules/auth/auth.schema.js';
import { restaurants } from './modules/restaurant/restaurant.schema.js';
import { menuItem } from './modules/menu/menu.schema.js';
import { order, orderItems } from './modules/order/order.schema.js';
import { paymentTable } from './modules/payment/payment.schema.js';

// Validate env var
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL must be defined in .env');
}

// Create Neon client & Drizzle
const sql = neon(process.env.DATABASE_URL);
export const db = drizzle({ client: sql, schema: { users, restaurants, menuItem, orderItems, order, paymentTable} });