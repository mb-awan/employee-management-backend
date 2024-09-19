import express, { Router } from "express";
import {
  createUserSalary,
  deleteUserSalary,
  getAllUsersSalary,
  getsingleUserSalary,
  updateUserSalary,
} from "../../common/controllers/invoice";
import { validateRequest } from "../../common/utils/httpHandlers";
import { salarySchema } from "./userSalarySchemas";
import { authenticate } from "../../common/utils/authenticate";

export const UserSalary = {
  getAll: "/",
  getSingle: "/getSingle",
  create: "/",
  update: "/",
  delete: "/",
};

export const userSalaryRoutes: Router = (() => {
  const router = express.Router();

  router.get(UserSalary.getAll, authenticate, getAllUsersSalary);
  router.get(UserSalary.getSingle, authenticate, getsingleUserSalary);
  router.post(
    UserSalary.create,
    authenticate,
    validateRequest(salarySchema),
    createUserSalary
  );
  router.put(
    UserSalary.update,
    authenticate,
    validateRequest(salarySchema),
    updateUserSalary
  );
  router.delete(UserSalary.delete, authenticate, deleteUserSalary);

  return router;
})();
