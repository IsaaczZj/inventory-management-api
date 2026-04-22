import { eq, isNull } from "drizzle-orm";
import { db } from "../db/connection";
import { NewUser, User, users } from "../db/schema";
import { hashPassword, verifyPassword } from "../helpers/hash-password";
import { AppError } from "../utils/app-error";
import jwt from "jsonwebtoken";
import { listUsersSchema } from "../validators/user-validator";

export const createUser = async (data: NewUser) => {
  const userExists = await getUserByEmail(data.email);

  if (userExists) {
    throw new AppError("E-mail já está em uso");
  }

  const passwordHash = await hashPassword(data.password);

  const newUser: NewUser = {
    ...data,
    password: passwordHash,
  };
  const result = await db.insert(users).values(newUser).returning();

  return formatUserReturn(result[0]);
};

export const login = async (email: string, password: string) => {
  const user = await getUserByEmail(email);

  if (!user) {
    throw new AppError("E-mail ou senha inválidos");
  }

  const passwordHash =
    user.password ??
    "$2b$10$fakeHashToPreventTimingAttack.fakeHashToPreventTimingAttack.fake";

  const isValidPassword = await verifyPassword(password, passwordHash);

  if (!isValidPassword) {
    throw new AppError("E-mail ou senha inválidos", 401);
  }

  const token = jwt.sign({ role: user.role }, process.env.JWT_SECRET!, {
    expiresIn: "1d",
    subject: user.id,
  });
  const formatedUser = formatUserReturn(user);

  return {
    token,
    role: formatedUser.role,
    name: formatedUser.name,
    email: formatedUser.email,
  };
};

export const me = async (id: string) => {
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  const user = result[0];
  if (!user || user.deletedAt) {
    throw new AppError("Usuário não encontrado", 404);
  }
  const formatedUser = formatUserReturn(user);
  return formatedUser;
};

export const listUsers = async (offset: number = 0, limit: number = 10) => {
  const usersList = await db
    .select()
    .from(users)
    .where(isNull(users.deletedAt))
    .offset(offset)
    .limit(limit);
  return usersList.map(formatUserReturn);
};

export const getUserById = async (id: string) => {
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  const user = result[0];

  if (!user || user.deletedAt) {
    throw new AppError("Usuário não encontrado", 404);
  }

  return formatUserReturn(user);
};

//Helpers
const getUserByEmail = async (email: string) => {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  const user = result[0];

  if (!user || user.deletedAt) return null;

  return user;
};

const formatUserReturn = (user: User) => {
  const { password, ...userWhithoutPassword } = user;

  if (userWhithoutPassword.avatar) {
    userWhithoutPassword.avatar = `${process.env.BASE_URL}/static/avatars/${userWhithoutPassword.avatar}`;
  }

  const { id, name, email, avatar, role } = userWhithoutPassword;

  return { id, name, email, avatar, role };
};
