import { eq } from "drizzle-orm";
import { db } from "../db/connection";
import { NewUser, User, users } from "../db/schema";
import { hashPassword, verifyPassword } from "../helpers/hash-password";
import { AppError } from "../utils/app-error";
import jwt from "jsonwebtoken";

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
    expiresIn: "1m",
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
  return userWhithoutPassword;
};
