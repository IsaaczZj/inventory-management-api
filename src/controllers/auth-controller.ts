import { RequestHandler } from "express";
import { authLoginSchema } from "../validators/auth-validator";
import * as userService from "../services/user-service";
export const login: RequestHandler = async (req, res) => {
  const { email, password } = authLoginSchema.parse(req.body);

  const result = await userService.login(email, password);
  res.status(200).json({ error: null, data: result });
};
