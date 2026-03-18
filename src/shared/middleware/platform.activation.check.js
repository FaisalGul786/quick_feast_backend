import { db } from "../../db.js";
import { eq } from "drizzle-orm";
import { restaurants } from "../../modules/restaurant/restaurant.schema.js";

export const platformActivationCheck = async(req,res,next)=>{
    try {const {id} = req.user;

    console.log('id middleware ', id);

    // # Get restaurant having owner_id  === id |  so we can check restaurant active status active or inactive 
    const restaurant = await db.query.restaurants.findFirst({
        where: eq(restaurants.owner_id, id)

    })
     console.log('restaurant middleware', restaurant);
     console.log('restaurant.status ', restaurant.status);
     if(restaurant.status === "ACTIVE") next()
     else {return res.status(403).json("No such action allowed")}
     
}
    catch(error) {
        console.log('error in middleware', error);
    }


}