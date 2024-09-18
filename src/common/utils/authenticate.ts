import env from "dotenv";

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { APIResponse } from "../utils/response";
import { StatusCodes } from "http-status-codes";
import { IUser } from "../types/users";
import * as express from "express";
import { IUserRequest } from "../utils/types";
env.config();

interface JwtPayload {
  id: string;
  username: string;
}

export const authenticate = (
  req: IUserRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    ) as JwtPayload;

    req.user = { id: decoded.id, username: decoded.username };
    next();
  } catch (err) {
    return APIResponse.error(
      res,
      "Invalid token",
      null,
      StatusCodes.BAD_REQUEST
    );
  }
};
