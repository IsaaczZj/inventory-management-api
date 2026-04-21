import { Router, Request, Response } from "express";
import { usersRoutes } from "./user-routes";
import { authRoutes } from "./auth-routes";

const router = Router();

router.get("/ping", (req: Request, res: Response) => {
  res.json({ pong: true });
});

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);

export { router };
