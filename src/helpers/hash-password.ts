import bcrypt from "bcrypt";
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt();

  return bcrypt.hash(password, salt);
};

export const verifyPassword = async (
  password: string,
  hashedPassowrd: string,
) => {
  const isPasswordValid = await bcrypt.compare(password, hashedPassowrd);

  return isPasswordValid;
};
