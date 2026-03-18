import { eq } from "drizzle-orm";
import {db} from "../../db.js"
import { menuItem } from "../menu/menu.schema.js";
import { restaurants } from "../restaurant/restaurant.schema.js";

export const fetchRestaurants = async() => {
    try {
        const response = await db.select().from(restaurants)

        return response;
    } catch(error) {
        console.log('error in fetch restaurants collection service');
        
    }
}


export const fetchMenuItems = async(restaurantId)=>{
    try {
        console.log('id to fetch detail of menu Items', restaurantId);
        

        const menuItems = await db.select().from(menuItem).where(eq(menuItem.restaurant_id, restaurantId));
        console.log("data menu items",menuItems);
        
        return menuItems;
    } catch(error) {
        
        console.log("error while fetch restaurant menu items");
        
    }
}