import { integer, numeric, pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "../auth/auth.schema.js";
import { restaurants } from "../restaurant/restaurant.schema.js";
import { menuItem } from "../menu/menu.schema.js";
import { sql } from "drizzle-orm";

export const status = pgEnum("order_status", ["PENDING", "PREPARING", "READY","COMPLETED", "CANCELED"]);

export const order = pgTable("orders", {
    id: uuid("id").defaultRandom().primaryKey(),
    customer_id: uuid("customer_id").notNull().references(() => users.id, {onDelete: "cascade"}),
    restaurant_id: uuid("restaurant_id").notNull().references(() => restaurants.id, {onDelete: "cascade"}),
    pickup_time: timestamp("pickup_time").default(sql`now() + interval '15 minutes'`).notNull(),
    order_status: status("order_status").notNull().default("PENDING"),
    total_amount: numeric("price", {precision: 10, scale: 2}).notNull(),
    payment_method: varchar("payment_method").default("COD"),
    created_at: timestamp("created_at").defaultNow().notNull()

});


export const orderItems = pgTable("orderItems", {
    id: uuid("id").defaultRandom().primaryKey(),
    order_id: uuid("order_id").notNull().references(() => order.id, {onDelete: "cascade"}),
    menu_item_id: uuid("menu_item_id").notNull().references(() => menuItem.id, {onDelete: "cascade"}),

    quantity: integer("quantity").notNull().default(1),
    order_time_price: numeric("order_time_price", { precision: 10, scale: 2 }).notNull(),

})