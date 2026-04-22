import z from "zod";

export const createUserSchema = z.object({
  name: z.string().min(1, "Nome é obrigatorio").max(255),
  email: z.email("Digite um e-mail válido"),
  password: z.string().min(4, "A senha deve ter no mínimo 4 caracteres"),
});

export const listUsersSchema = z.object({
  offset: z.coerce.number().int().min(0).optional().default(0),
  limit: z.coerce.number().int().min(1).optional().default(10),
});

export const userIdSchema = z.object({
  id: z.uuid("Id do usuário inválido"),
});
