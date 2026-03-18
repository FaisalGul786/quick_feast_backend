import {Router} from "express";
import {createMenu} from "./menu.controller.js"

const router = Router();

router.post("/create/:restaurantId", createMenu);

export default router;