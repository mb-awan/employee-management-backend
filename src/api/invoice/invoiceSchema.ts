import mongoose from "mongoose";
import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

// Extend Zod to include OpenAPI methods
extendZodWithOpenApi(z);

export const createInvoiceSchema = z.object({
  basicPay: z.number().min(0, "Basic pay must be a positive number"),
  committedHours: z
    .number()
    .min(0, "Committed hours must be a positive number"),
  workingHours: z.number().min(0, "Working hours must be a positive number"),
  publiceLeaves: z.number().min(0, "Public leaves must be a positive number"),
  publicLeaveWorkingHour: z
    .number()
    .min(0, "Public leave working hour must be a positive number"),
  PaidLeavesformonth: z
    .number()
    .min(0, "Paid leaves must be a positive number"),
  requiredHoursThisMonth: z
    .number()
    .min(0, "Required hours must be a positive number"),
  overTimeHours: z.number().min(0, "Overtime hours must be a positive number"),
  basicPayPerHourThisMonth: z
    .number()
    .min(0, "Basic pay per hour must be a positive number"),
  overTimePayPerHourThisMonth: z
    .number()
    .min(0, "Overtime pay per hour must be a positive number"),
  publicHoursPayPerHourThisMonth: z
    .number()
    .min(0, "Public hours pay per hour must be a positive number"),
  totalBasicSalaryThisMonth: z
    .number()
    .min(0, "Total basic salary must be a positive number"),
  overTimePayThisMonth: z
    .number()
    .min(0, "Overtime pay must be a positive number"),
  totalPublicLeavesPayThisMonth: z
    .number()
    .min(0, "Total public leaves pay must be a positive number"),
  totalSalaryThisMonth: z
    .number()
    .min(0, "Total salary must be a positive number"),
});

export const updateInvoiceSchema = z.object({
  basicPay: z.number().min(0).optional(),
  committedHours: z.number().min(0).optional(),
  workingHours: z.number().min(0).optional(),
  publiceLeaves: z.number().min(0).optional(),
  publicLeaveWorkingHour: z.number().min(0).optional(),
  PaidLeavesformonth: z.number().min(0).optional(),
  requiredHoursThisMonth: z.number().min(0).optional(),
  overTimeHours: z.number().min(0).optional(),
  basicPayPerHourThisMonth: z.number().min(0).optional(),
  overTimePayPerHourThisMonth: z.number().min(0).optional(),
  publicHoursPayPerHourThisMonth: z.number().min(0).optional(),
  totalBasicSalaryThisMonth: z.number().min(0).optional(),
  overTimePayThisMonth: z.number().min(0).optional(),
  totalPublicLeavesPayThisMonth: z.number().min(0).optional(),
  totalSalaryThisMonth: z.number().min(0).optional(),
});

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
