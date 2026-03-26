// Note :  This route is only for customer to trigger payment and web-hook donot 
//  need customer call rather call by stripe so write only route no middleware

// # This will properly fire as triggered by customer

import { Router } from "express";
import { auth_check } from "../../shared/middleware/auth.check.js";
import { makePayment } from "./payment.controller.js";

const router = Router();

router.post("/", auth_check, makePayment);

export default router;