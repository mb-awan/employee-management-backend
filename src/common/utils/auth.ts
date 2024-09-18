import { env } from "./envConfig";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const generateToken = (id: any, username: string) => {
  const payload = {
    id: id,
    username: username,
  };

  const token = jwt.sign(payload, env.JWT_SECRET_KEY as string, {
    expiresIn: env.JWT_EXPIRES_IN as string,
  });

  return token;
};

export const hashPassword = async (password: string) => {
  const saltRounds = Number(env.BCRYPT_SALT_ROUNDS) || 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  return hashedPassword;
};

export const isValidPassword = async (
  password: string,
  hashedPassword: string
) => {
  const validPassword = await bcrypt.compare(password, hashedPassword);

  return validPassword;
};
