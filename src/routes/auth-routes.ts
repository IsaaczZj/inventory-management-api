import { Router } from "express";
import * as authController from "../controllers/auth-controller";
const authRoutes = Router();

authRoutes.post("/login", authController.login);
export { authRoutes };
