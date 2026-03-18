import { pgTable, varchar, text, uuid, timestamp, unique, pgEnum } from "drizzle-orm/pg-core";

// 1. IMPORTANT: The users table MUST be defined or imported 
// BEFORE the restaurants table for the references to work.
import { users } from "../auth/auth.schema.js";

export const restaurantStatusEnum = pgEnum("status", ["ACTIVE", "INACTIVE"]);


export const restaurants = pgTable("restaurants", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    address: text("address").notNull(),
    status: restaurantStatusEnum("status").notNull().default("INACTIVE"),
    owner_id: uuid("owner_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    created_at: timestamp("created_at").defaultNow().notNull()
}, 
(t) => ({
    // FIX: Add an explicit name string inside unique() to remove the deprecation warning
    uniqueNamePerOwner: unique("unique_name_per_owner_constraint").on(t.name, t.owner_id),
}));