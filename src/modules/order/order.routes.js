import { Router } from "express";

import { placeOrder, updateOrderStatus , fetchOrders } from "./order.controller.js";
import { auth_check } from "../../shared/middleware/auth.check.js";
import { platformActivationCheck } from "../../shared/middleware/platform.activation.check.js";
const router = Router();

router.post("/:restaurant_id",auth_check , placeOrder);

router.get("/orders", auth_check, fetchOrders);

router.patch("/status", auth_check, platformActivationCheck, updateOrderStatus);

export default router;