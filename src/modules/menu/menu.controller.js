import { createItem } from "./menu.service.js";

export const createMenu = async(req,res) => {
    try{
        const data = req.body;
        console.log('menu data', data);
        
        const {restaurantId} = req.params;
        console.log('restaurant id', restaurantId);
        
        data.restaurant_id = restaurantId;
        console.log('menu data final', data);


        // const {id} = req.usser;
        // console.log('owner id', id);  # Latter if check ownership again

        const response = await createItem(data);
        console.log('menu item response', response);
        return res.status(201).json(response);
        

        
        
        
        
    } catch(error){
        console.log("menu not created", error);
    }
}