import { RequestHandler } from "express";
import { authLoginSchema } from "../validators/auth-validator";
import * as userService from "../services/user-service";
import { AppError } from "../utils/app-error";
import { userIdSchema } from "../validators/user-validator";
export const login: RequestHandler = async (req, res) => {
  const { email, password } = authLoginSchema.parse(req.body);

  const result = await userService.login(email, password);
  res.status(200).json({ error: null, data: result });
};

export const me: RequestHandler = async (req, res) => {
  if (!req.user) throw new AppError("Não autenticado", 401);

  const user = await userService.me(req.user.id);
  res.status(200).json({ error: null, data: user });
};
