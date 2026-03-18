import { numeric, pgEnum, pgTable, text, timestamp, varchar, uuid } from "drizzle-orm/pg-core";
import { restaurants } from "../restaurant/restaurant.schema.js";
export const isItemAvailable = pgEnum("item_availabillity", ["YES", "NO"]);

export const menuItem = pgTable("menuItems",{
    id: uuid("id").defaultRandom().primaryKey(),
    // # making relation with restaurant Table
    restaurant_id: uuid("restaurant_id")
    .notNull()
    .references(() => restaurants.id, { onDelete: "cascade" }),
    item_name: varchar("item_name", {length: 255}).notNull(),
    description: text("description").notNull(),
    price: numeric("price", {precision: 10, scale: 2}).notNull(),
    is_available: isItemAvailable("is_available").notNull().default("YES"),
    created_at: timestamp("created_at").defaultNow().notNull()

})