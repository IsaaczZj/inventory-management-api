import z from "zod";

export const createUserSchema = z.object({
  name: z.string().min(1, "Nome é obrigatorio").max(255),
  email: z.email("Digite um e-mail válido"),
  password: z.string().min(4, "A senha deve ter no mínimo 6 caracteres"),
});
