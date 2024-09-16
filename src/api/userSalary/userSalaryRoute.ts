import express, { Router } from "express";
import {
  createUserSalary,
  deleteUserSalary,
  getAllUsersSalary,
  getsingleUserSalary,
  updateUserSalary,
} from "../../common/controllers/userSalary";
import { validateRequest } from "../../common/utils/httpHandlers";
import { salarySchema } from "./userSalarySchemas";
import { authenticate } from "../../common/utils/authenticate";

export const UserSalary = {
  getAll: "/all",
  getSingle: "/getSingle",
  create: "/create",
  update: "/update",
  delete: "/delete",
};

export const userSalaryRoutes: Router = (() => {
  const router = express.Router();

  router.get(UserSalary.getAll, authenticate, getAllUsersSalary);
  router.get(UserSalary.getSingle, getsingleUserSalary);
  router.post(
    UserSalary.create,
    authenticate,
    validateRequest(salarySchema),
    createUserSalary
  );
  router.put(
    UserSalary.update,
    validateRequest(salarySchema),
    updateUserSalary
  );
  router.delete(UserSalary.delete, deleteUserSalary);

  return router;
})();
