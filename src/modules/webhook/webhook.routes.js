import { Router } from "express";
import { webhookHandler } from "./webhook.controller.js";
const router = Router();

router.post("/", webhookHandler);

export default router;