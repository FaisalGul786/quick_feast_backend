import {db} from "../../db.js";
import { eq } from "drizzle-orm";
import { menuItem } from "../menu/menu.schema.js";
import { order, orderItems } from "./order.schema.js";

import { restaurants } from "../restaurant/restaurant.schema.js";

export const placeOrderHandler = async(menu_item_id, quantity, restaurant_id, customer_id) => {
    // # fetch menu item so can calculate price
    

        console.log("all data", menu_item_id, quantity, restaurant_id, customer_id);
        
        const selectedMenuItem = await db.query.menuItem.findFirst({
            where: eq(menuItem.id, menu_item_id)        
        });
        console.log("menu item from service" ,selectedMenuItem);

        // calculate Total amount
        const total_amount = quantity * parseFloat(selectedMenuItem.price);
        console.log("calculated toal", total_amount)

        // # just create 2 tables => order , order_items
        const orderTable = await db.insert(order).values(
            {customer_id,
            restaurant_id,
            total_amount}
        ).returning();

        console.log("order Table created", orderTable);
        console.log("Moving to order items table");

        // # preparing object to add in order items table
        const orderItemsData = {
            order_id: orderTable[0].id,
            menu_item_id,
            quantity,
            order_time_price: selectedMenuItem.price
        }
        
        console.log("order item data obj", orderItemsData);
        const orderItemsTable = await db.insert(orderItems).values(
            orderItemsData
        ).returning();
        
        console.log("order items table", orderItemsTable);
        
        
        

        return orderTable
        
    
}

// __________________
// # Fetch order all
// ______________________
export const fetchAllOrders = async(owner_id) => {

    const ownerOrders = await db
          .select({
            order: order, // Select all order fields
            name: restaurants.name, // Grab the restaurant name for the UI
          })
          .from(order)
          // Join the restaurant table where order.restaurant_id matches
          .innerJoin(restaurants, eq(order.restaurant_id, restaurants.id))
          // ONLY return rows where the restaurant's user_id matches the logged-in owner
          .where(eq(restaurants.owner_id, owner_id));
    
        return(ownerOrders);
}



// __________________
// # update order status
// ______________________

export const updatedOrder = async(order_id, status_val)=>{

    try{
        const updatedStatus = await db.update(order).set({
            order_status : status_val
        }).where(eq(order.id, order_id)).returning();

        console.log("updated status of order", updatedStatus);
        return updatedStatus
        
    }catch(error){
        console.log("Error while updating order status  service")
    }
}