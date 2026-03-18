import { createRestaurant, updateRestaurant, togglePlatformAvailabillity, fetchRestaurant } from "./restaurant.service.js";
import { db } from "../../db.js";

export const createRestaurantHandler = async (req, res) => {
  console.log('checking auth ', req.user);
  console.log('request arrived ');
  try {
    const { name, description, address } = req.body;
    console.log('checking data ', name, description, address);

    const restaurant = await createRestaurant(name, description, address, req.user);

    return res.status(201).json({message: "created"});
  } catch (error) {
    if(error.code === "restaurant_created_issue") return res.json({message: "Restaurant not created!"})
    res.status(500).json({ error: "Failed to create restaurant" });
  }
};


// # 2. update restaurant by owner
// # __________________________

export const updateRestaurantHandler = async (req, res) => {
  console.log('request arrived to update restaurant');
  try {
    const { id } = req.params;

    console.log('id to update restaurant', typeof(id));
    const { name, description, address } = req.body;
    const data = { id, name, description, address };
    const payload = req.user;
    console.log('payload to update restaurant in update restaurant', payload);
    // check also whether the restaurant is owned by the user or not by req.user.id
    const restaurant = await db.query.restaurants.findFirst({
      // Use a callback to get access to 'restaurants' and 'eq'
      where: (restaurants, { eq }) => eq(restaurants.id, id) 
    });
    if(!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }
    if(restaurant.owner_id !== payload.id) {
      return res.status(403).json({ error: "You are not authorized to update this restaurant" });
    }
    const updatedRestaurant = await updateRestaurant(data);
    res.status(200).json(updatedRestaurant);
} catch (error) {
  console.log('error while updating restaurant ', error);
  res.status(500).json({ error: "Failed to update restaurant" });
}
}


// ___________________________
// # 3
// Toggle Platform


export const activeRestaurant = async(req,res)=>{
  try {
    console.log('request is reaching to controller');
    const {toggleValue} = req.body;
    const {id } = req.params; // restaurant Id
    console.log('toggle value ', toggleValue);
    console.log('id ', id);

    const response = await togglePlatformAvailabillity(toggleValue, id);
    console.log("response after restaurant active", response);
     return res.status(200).json(response);
  } catch(error) {
    console.log('error while toggle ', error);
    return res.status(500).json({error: "no toggle restaurant "})
  }
}


// # ___________________
      // fetch all restaurants data for owner

// # _____________________

export const fetchRestaurants = async(req,res)=> {
  try {
    // # Get id from req.user to get only owner (owned) restaurants
    const {id} = req.user; // owner id
    const restaurants = await fetchRestaurant(id);
    console.log("All restaurants data", restaurants);

    return res.status(200).json(restaurants);
  } catch(error) {
    console.log("error while fetching error", error);

    if(error.code === "not_found_restaurant"){

      return res.status(404).json({message: "Not Found!"})
    }
    
  }
}