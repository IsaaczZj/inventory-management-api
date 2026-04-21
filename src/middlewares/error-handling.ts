import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/app-error";

export const errorHandling: ErrorRequestHandler = (error, _, res, __) => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({ error: error.message, data: null });
    return;
  }

  if (error instanceof ZodError) {
    const errorMessage = error.issues.map((error) => error.message).join(", ");
    res.status(400).json({ error: errorMessage, data: null });
    return;
  }

  console.error("Error", error);
  res.status(500).json({ error: "Erro interno do servidor", data: null });
};
