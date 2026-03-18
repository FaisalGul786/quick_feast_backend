import { db } from "../../db.js";
import { restaurants } from "./restaurant.schema.js";
import { eq } from "drizzle-orm";


export const createRestaurant = async (name, description, address, payload) => {

  
    // # add service level check using owner JWT id see whether restaurant name per owner is unique or not
    // # also handle database level error as owner restaurant name if not unique it may send 
    // raw error to user
    const response = await db.insert(restaurants).values({
      name,
      description,
      address,
      owner_id: payload.id
    }).returning();
    
    if(!response) {
      const error = new Error("Restaurant not created!");
      error.code = "restaurant_created_issue" ;
      throw error
    }
    console.log("response of CRUD ", response);
    return response
  
};


// _____________________________ 
// #2
// UPDATE RESTAURANT
// __________________________

export const  updateRestaurant = async(data) => {
  console.log('data to update restaurant', data);
  try {
    const {id, ...restParams} = data;
    console.log('restParams to update restaurant', restParams);
    const response = await db.update(restaurants).set(restParams).where(eq(restaurants.id, id)).returning();
    console.log('response of CRUD update Restaurant', response);
    return response;
  }
  catch(error){
    console.log('error while updating restaurant ', error);
  }
}



// ____________________
// # 3
// toggle availbility of platform
// ____________________


export const togglePlatformAvailabillity = async(value, id) => {
  // # value is either ACTIVE or INACTIVE

  try {
    const response = await db.update(restaurants).set({
    status: value
  }).where(eq(restaurants.id, id)).returning();
return response;
}
  catch(error) {
    console.log('error while toggle restaurant', error);
  }
}


//  _____________________________ 
// #4
// UPDATE RESTAURANT
// __________________________

export const fetchRestaurant = async(owner_id) => {
  
  const ownedRestaurants = await db
  .select()
  .from(restaurants)
  .where(eq(restaurants.owner_id, owner_id));
  
  console.log("All restaurant data in service", ownedRestaurants);

  if(!ownedRestaurants) {
    const error = new Error("no restaurant");
    error.code = "not_found_restaurant";

    throw error;
  }

  return  ownedRestaurants;
}