import { RequestHandler } from "express";
import {
  createUserSchema,
  listUsersSchema,
  userIdSchema,
} from "../validators/user-validator";
import * as userService from "../services/user-service";
import { AppError } from "../utils/app-error";

export const createUser: RequestHandler = async (req, res) => {
  const data = createUserSchema.parse(req.body);

  const user = await userService.createUser(data);
  res.status(201).json({ error: null, data: user });
};

export const listUsers: RequestHandler = async (req, res) => {
  const { limit, offset } = listUsersSchema.parse(req.query);

  const users = await userService.listUsers(offset, limit);
  res.status(200).json({ error: null, data: users });
};

export const getUserById: RequestHandler = async (req, res) => {
  const { id } = userIdSchema.parse(req.params);
  const user = await userService.getUserById(id);
  res.status(200).json({ error: null, data: user });
};

export const deleteUser: RequestHandler = async (req, res) => {
  const { id } = userIdSchema.parse(req.params);
  const deletedUser = await userService.deleteUser(id);
  if (!deletedUser) throw new AppError("Usuário não encontrado", 404);
  res.status(200).json({ error: null, data: "Usuário deletado com sucesso" });
};
