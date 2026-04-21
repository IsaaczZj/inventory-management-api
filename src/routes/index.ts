import { Router, Request, Response } from "express";
import { usersRoutes } from "./user-routes";
import { authRoutes } from "./auth-routes";
import { verifyUserAuthenticated } from "../middlewares/verify-user-authenticated";

const router = Router();

router.get("/ping", (req: Request, res: Response) => {
  res.json({ pong: true });
});

router.use("/auth", authRoutes);

router.use(verifyUserAuthenticated);
router.use("/users", usersRoutes);

export { router };
