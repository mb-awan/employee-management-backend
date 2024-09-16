import env from "dotenv";

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { APIResponse } from "../utils/response";
import { StatusCodes } from "http-status-codes";
import { IUser } from "../types/users";
import * as express from "express";
env.config();

export interface IUserRequest extends express.Request {
  id?: string;
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
  jwt.verify(token, process.env.JWT_SECRET_KEY as string, (err, decoded) => {
    if (err) {
      return APIResponse.error(
        res,
        "Invalid token",
        null,
        StatusCodes.BAD_REQUEST
      );
    }

    console.log("Authenticate", decoded);
    const { id } = decoded as { id: string };

    req.id = id;
    next();
  });
};
