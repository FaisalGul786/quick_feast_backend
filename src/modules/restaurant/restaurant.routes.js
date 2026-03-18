import { Router } from "express";
import { createRestaurantHandler,updateRestaurantHandler , activeRestaurant, fetchRestaurants } from "./restaurant.controller.js";
import { auth_check } from "../../shared/middleware/auth.check.js";
import { platformActivationCheck } from "../../shared/middleware/platform.activation.check.js";

const router = Router();

router.post("/",auth_check, createRestaurantHandler);
router.get("/all", auth_check, fetchRestaurants);
router.patch("/:id",auth_check,platformActivationCheck, updateRestaurantHandler);
router.patch("/platform-active-status/:id", auth_check, activeRestaurant);

export default router;
