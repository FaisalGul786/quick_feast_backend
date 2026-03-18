import { Router } from "express";

import { restaurantsCollection, restaurantDetail } from "./catalog.controller.js";

const router = Router();

router.get("/restaurants", restaurantsCollection);
router.get("/:restaurantId",  restaurantDetail);
export default router;