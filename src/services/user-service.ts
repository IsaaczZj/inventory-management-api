import { eq } from "drizzle-orm";
import { db } from "../db/connection";
import { NewUser, User, users } from "../db/schema";
import { hashPassword } from "../helpers/hash-password";

export const createUser = async (data: NewUser) => {
  const userExists = await getUserByEmail(data.email);

  if (userExists) {
    throw new Error("E-mail já está em uso");
  }

  const passwordHash = await hashPassword(data.password);

  const newUser: NewUser = {
    ...data,
    password: passwordHash,
  };
  const result = await db.insert(users).values(newUser).returning();

  return formatUserReturn(result[0]);
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
