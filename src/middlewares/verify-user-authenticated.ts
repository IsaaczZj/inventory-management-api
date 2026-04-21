import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/app-error";
interface TokenPayload {
  role: string;
  sub: string;
}
export const verifyUserAuthenticated: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError("Token JWT não encontrado", 401);
    }

    const [scheme, token] = authHeader.split(" ");
    if (scheme !== "Bearer" || !token) {
      throw new AppError("Token JWT não encontrado", 401);
    }

    const { role, sub: userId } = jwt.verify(
      token,
      process.env.JWT_SECRET!,
    ) as TokenPayload;

    req.user = {
      id: userId,
      role,
    };

    return next();
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError("Token JWT inválido", 401);
  }
};
