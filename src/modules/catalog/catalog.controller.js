import { fetchRestaurants, fetchMenuItems } from "./catalog.service.js";
export const restaurantsCollection = async(req,res)=>{
    try{

        const response = await fetchRestaurants();
        console.log('all restaurants data', response);

        return res.status(200).json(response);
        

    } catch(error) {
        console.log('Error while fetching all restaurants collection');
        
    }
}


// # get single restaurant data details
export const restaurantDetail = async(req,res)=>{
    try {
        const {restaurantId} = req.params;
        console.log("restaurant id to fetch restaurant menu items", restaurantId)

        const allMenuItems = await fetchMenuItems(restaurantId);

        return res.status(200).json(allMenuItems);
    } catch(error) {
        console.log("error while fetching restaurant details");
        
    }
}