import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { apiRoutes } from "../../common/constants/common";

import { authPaths } from "./authRoute";
import {
  LoginUserValidationSchema,
  RegisterUserValidationSchema,
} from "./authSchema";

export const authRegistry = new OpenAPIRegistry();

authRegistry.registerPath({
  method: "post",
  description: `
        This endpoint allows users to register by providing their registration information:
          - Validation: Validate all fields.
          - Password Handling: Hash the password securely before storing it.
          - Database Interaction: Save user data to the database.
          - Token Generation: Generate a JWT token and send it in the response.
      `,
  path: `${apiRoutes.auth}${authPaths.register}`,
  request: {
    body: {
      description: "User registration details",
      content: {
        "application/json": {
          schema: RegisterUserValidationSchema,
        },
      },
    },
  },
  tags: ["Auth"],
  responses: {
    200: {
      description: "User registration successful",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
            token: z.string(),
          }),
        },
      },
    },
    400: {
      description: "Invalid input or User already exists",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().default(false),
            message: z.string(),
            responseObject: z.object({}).nullable().optional(),
            statusCode: z.number().optional(),
          }),
        },
      },
    },
    409: {
      description: "Conflict: User already exists",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
          }),
        },
      },
    },
    500: {
      description: "Internal server error",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
            error: z.object({}).nullable(),
          }),
        },
      },
    },
  },
});

authRegistry.registerPath({
  method: "post",
  description: `
        This endpoint allows users to log in with their credentials:
          - Validation: Validate user email and password.
          - Authentication: Verify that the user exists and that the provided password is correct.
          - Token Generation: Generate a JWT token and return it upon successful login.
      `,
  path: `${apiRoutes.auth}${authPaths.login}`,
  request: {
    body: {
      description: "User login details",
      content: {
        "application/json": {
          schema: LoginUserValidationSchema,
        },
      },
    },
  },
  tags: ["Auth"],
  responses: {
    200: {
      description: "User login successful",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
            token: z.string(),
          }),
        },
      },
    },
    400: {
      description: "Invalid credentials",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().default(false),
            message: z.string(),
            responseObject: z.object({}).nullable().optional(),
            statusCode: z.number().optional(),
          }),
        },
      },
    },
    500: {
      description: "Internal server error",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
            error: z.object({}).nullable(),
          }),
        },
      },
    },
  },
});
