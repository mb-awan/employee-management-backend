require("dotenv").config();
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const generateToken = (id: any) => {
  const payload = {
    id: id,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY as string, {
    expiresIn: process.env.JWT_EXPIRES_IN as string,
  });

  return token;
};

export const hashPassword = async (password: string) => {
  const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
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
