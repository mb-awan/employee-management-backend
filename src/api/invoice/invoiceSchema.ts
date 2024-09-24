import mongoose from "mongoose";
import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

// Extend Zod to include OpenAPI methods
extendZodWithOpenApi(z);

export const createInvoiceSchema = z
  .object({
    basicPayForThisMonth: z
      .number()
      .min(0, "Basic pay must be a positive number"),
    committedHoursForThisMonth: z
      .number()
      .min(0, "Committed hours must be a positive number"),
    workingHoursForThisMonth: z
      .number()
      .min(0, "Working hours must be a positive number"),
    publiceLeavesForThisMonth: z
      .number()
      .min(0, "Public leaves must be a positive number"),
    publiceLeaveWorkingHourForThisMonth: z
      .number()
      .min(0, "Public leave working hour must be a positive number"),
    paidLeavesForThisMonth: z
      .number()
      .min(0, "Paid leaves must be a positive number"),
  })
  .strict();

export const updateInvoiceSchema = z
  .object({
    invoiceId: z
      .string()
      .refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: "Invalid invoice ID",
      }),
    basicPayForThisMonth: z
      .number()
      .min(0, "Basic pay must be a positive number")
      .optional(),
    committedHoursForThisMonth: z
      .number()
      .min(0, "Committed hours must be a positive number")
      .optional(),
    workingHoursForThisMonth: z
      .number()
      .min(0, "Working hours must be a positive number")
      .optional(),
    publiceLeavesForThisMonth: z
      .number()
      .min(0, "Public leaves must be a positive number")
      .optional(),
    publicLeaveWorkingHourForThisMonth: z
      .number()
      .min(0, "Public leave working hour must be a positive number")
      .optional(),
    paidLeavesForThisMonth: z
      .number()
      .min(0, "Paid leaves must be a positive number")
      .optional(),
  })
  .strict();

export const getAllInvoicesSchema = z.object({
  page: z.string().regex(/^\d+$/, "Page must be a number").optional(),
  limit: z.string().regex(/^\d+$/, "Limit must be a number").optional(),
});

export const getSingleInvoiceSchema = z.object({
  invoiceId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid invoice ID",
  }),
});

export const deleteInvoiceSchema = z.object({
  invoiceId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid invoice ID",
  }),
});
