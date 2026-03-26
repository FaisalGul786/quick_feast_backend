import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { order } from "../order/order.schema.js";
import { users } from "../auth/auth.schema.js";

export const paymentTable = pgTable("paymentTable",{
    id: uuid("id").defaultRandom().primaryKey(),
    stripe_session_id: text('stripe_session_id').unique(),
    stripe_payment_intent_id: text('stripe_payment_intent_id')
    .unique(),

    order_id: uuid("order_id").notNull().references(() => order.id, {onDelete: "cascade"}),
    customer_id: uuid("customer_id").notNull().references(() => users.id, {onDelete: "cascade"}),

    amount: integer('amount').notNull(),
    currency: text('currency').notNull().default('usd'),
    method: text('method'),         // nullable until confirmed

    status: text('status')
    .notNull()
    .default('PENDING'),

    paid_at: timestamp('paid_at'),  // nullable
    created_at: timestamp('created_at').defaultNow()
});