import express, { Router } from 'express';
import { createUserSalary, deleteUserSalary, getAllUsersSalary, getsingleUserSalary, updateUserSalary } from '../../common/controllers/user';


export const UserSalary = {

  getAll : '/all',
  getSingle :'/getSingle',
  create : '/create',
  update : '/update',
  delete : '/delete',      
}

export const userSalaryRoutes: Router = (() => {
      const router = express.Router();

      router.get(UserSalary.getAll, getAllUsersSalary  )
      router.get(UserSalary.getSingle,getsingleUserSalary )
      router.post(UserSalary.create, createUserSalary )
      router.put(UserSalary.update, updateUserSalary )
      router.delete(UserSalary.delete, deleteUserSalary )

      return router;

})();