import { Router } from "express";
import {Register, signIn} from "./auth.controller.js";
const router = Router();

router.post('/register', Register);

router.post('/login', signIn);

export default router;