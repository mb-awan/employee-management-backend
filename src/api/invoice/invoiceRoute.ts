import express, { Router } from "express";
import {
  createInvoice,
  deleteInvoice,
  getAllInvoices,
  getSingleInvoice,
  updateInvoice,
} from "../../common/controllers/invoice";
import { validateRequest } from "../../common/utils/httpHandlers";
import { authenticate } from "../../common/utils/authenticate";
import {
  createInvoiceSchema,
  deleteInvoiceSchema,
  getAllInvoicesSchema,
  getSingleInvoiceSchema,
  updateInvoiceSchema,
} from "./invoiceSchema";

export const invoicePaths = {
  getAll: "/",
  getSingle: "/getSingle",
  create: "/",
  update: "/",
  delete: "/",
};

export const invoiceRoutes: Router = (() => {
  const router = express.Router();

  router.get(
    invoicePaths.getAll,
    authenticate,
    validateRequest(getAllInvoicesSchema),
    getAllInvoices
  );
  router.get(
    invoicePaths.getSingle,
    authenticate,
    validateRequest(getSingleInvoiceSchema),
    getSingleInvoice
  );
  router.post(
    invoicePaths.create,
    authenticate,
    validateRequest(createInvoiceSchema),
    createInvoice
  );
  router.put(
    invoicePaths.update,
    authenticate,
    validateRequest(updateInvoiceSchema),
    updateInvoice
  );
  router.delete(
    invoicePaths.delete,
    authenticate,
    validateRequest(deleteInvoiceSchema),
    deleteInvoice
  );

  return router;
})();
