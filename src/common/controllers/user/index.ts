import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Types } from "mongoose";
import { generateToken, hashPassword, isValidPassword } from "../../utils/auth";
import User from "../../models/user";
import { APIResponse } from "../../utils/response";

// Register user controller
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return APIResponse.error(
        res,
        "User already exists",
        StatusCodes.BAD_REQUEST
      );
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save user to database
    await newUser.save();

    // Generate JWT token
    const token = generateToken(newUser._id, newUser.username);

    APIResponse.success(res, "User registered successfully", {
      token,
    });
  } catch (error) {
    console.error("Error in register User:", error);
    return APIResponse.error(res, "Server error", StatusCodes.BAD_REQUEST);
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, username, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (!user) {
      return APIResponse.error(
        res,
        "Invalid credentials",
        StatusCodes.BAD_REQUEST
      );
    }

    // Check if password is correct
    const isPasswordValid = await isValidPassword(password, user.password);
    if (!isPasswordValid) {
      return APIResponse.error(
        res,
        "Invalid credentials",
        StatusCodes.BAD_REQUEST
      );
    }

    // Generate JWT token
    const token = generateToken(user._id, user.username);

    // Send success response
    return APIResponse.success(res, "User logged in successfully", { token });
  } catch (error: unknown) {
    console.error(
      "Error in login User:",
      error instanceof Error ? error.message : String(error)
    );

    // Send error response only once
    return APIResponse.error(
      res,
      "Server error",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
