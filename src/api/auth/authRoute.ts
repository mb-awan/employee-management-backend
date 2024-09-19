import express, { Router } from "express";

import { loginUser, registerUser } from "../../common/controllers/user";

import { validateRequest } from "../../common/utils/httpHandlers";

import {
  LoginUserValidationSchema,
  RegisterUserValidationSchema,
} from "./authSchema";

export const authPaths = {
  register: "/register",
  login: "/login",
};

export const authRoutes: Router = (() => {
  const router = express.Router();

  router.post(
    authPaths.register,
    validateRequest(RegisterUserValidationSchema),
    registerUser
  );

  router.post(
    authPaths.login,
    validateRequest(LoginUserValidationSchema),
    loginUser
  );

  return router;
})();
