import { Router } from "express";
import * as userController from "../controllers/user-controller";

const usersRoutes = Router();

usersRoutes.post("/", userController.createUser);
export { usersRoutes };
