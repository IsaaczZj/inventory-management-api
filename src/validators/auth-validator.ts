import z from "zod";

export const authLoginSchema = z.object({
  email: z.email("Digite um e-mail válido"),
  password: z.string().min(4, "A senha deve ter no mínimo 4 caracteres"),
});
