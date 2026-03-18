import { db } from "../../db.js";
import {menuItem} from "./menu.schema.js"

export const createItem = async(data)=>{
    try {
console.log('data in menu service', data);

        const response = await db.insert(menuItem).values(data).returning();
        console.log('response of menu item', response);
        return response;
        




    } catch(error){
        console.log("error is menu service", error);
        
    }
}