import { Router } from "express";
import * as userController from "../controllers/user-controller";

const usersRoutes = Router();

usersRoutes.post("/", userController.createUser);

usersRoutes.get("/", userController.listUsers);

usersRoutes.get("/:id", userController.getUserById);

usersRoutes.delete("/:id", userController.deleteUser);
export { usersRoutes };
