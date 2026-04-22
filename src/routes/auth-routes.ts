import { Router } from "express";
import * as authController from "../controllers/auth-controller";
import { verifyUserAuthenticated } from "../middlewares/verify-user-authenticated";
const authRoutes = Router();

authRoutes.post("/login", authController.login);
authRoutes.get("/me", verifyUserAuthenticated, authController.me);
export { authRoutes };
