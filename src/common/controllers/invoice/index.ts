import mongoose from "mongoose";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { APIResponse } from "../../utils/response";
import User from "../../models/user";
import { log } from "console";
import { IUserRequest } from "../../utils/types";
import Invoice from "../../models/invoice";

import { invoicePaths } from "../../../api/invoice/invoiceRoute";
import {
  transformInvoice,
  transformInvoicesArray,
} from "../../utils/transformResoonse";
export const createInvoice = async (req: IUserRequest, res: Response) => {
  const user = req.user;
  try {
    const {
      basicPay,
      committedHours,
      workingHours,
      publiceLeaves,
      publicLeaveWorkingHour,
      PaidLeavesformonth,
      requiredHoursThisMonth,
      overTimeHours,
      basicPayPerHourThisMonth,
      overTimePayPerHourThisMonth,
      publicHoursPayPerHourThisMonth,
      totalBasicSalaryThisMonth,
      overTimePayThisMonth,
      totalPublicLeavesPayThisMonth,
      totalSalaryThisMonth,
    } = req.body;

    console.log(req.body);

    const existingInvoice = await Invoice.findOne({
      basicPay,
      committedHours,
      workingHours,
      publiceLeaves,
      publicLeaveWorkingHour,
      PaidLeavesformonth,
      requiredHoursThisMonth,
      overTimeHours,
      basicPayPerHourThisMonth,
      overTimePayPerHourThisMonth,
      publicHoursPayPerHourThisMonth,
      totalBasicSalaryThisMonth,
      overTimePayThisMonth,
      totalPublicLeavesPayThisMonth,
      totalSalaryThisMonth,
    });

    if (existingInvoice) {
      return APIResponse.error(
        res,
        "Duplicate  data found",
        StatusCodes.CONFLICT
      );
    }

    const newInvoice = new Invoice({
      basicPay: Math.ceil(basicPay),
      committedHours: Math.ceil(committedHours),
      workingHours: Math.ceil(workingHours),
      publiceLeaves: Math.ceil(publiceLeaves),
      publicLeaveWorkingHour: Math.ceil(publicLeaveWorkingHour),
      PaidLeavesformonth: Math.ceil(PaidLeavesformonth),
      requiredHoursThisMonth: Math.ceil(requiredHoursThisMonth),
      overTimeHours: Math.ceil(overTimeHours),
      basicPayPerHourThisMonth: Math.ceil(basicPayPerHourThisMonth),
      overTimePayPerHourThisMonth: Math.ceil(overTimePayPerHourThisMonth),
      publicHoursPayPerHourThisMonth: Math.ceil(publicHoursPayPerHourThisMonth),
      totalBasicSalaryThisMonth: Math.ceil(totalBasicSalaryThisMonth),
      overTimePayThisMonth: Math.ceil(overTimePayThisMonth),
      totalPublicLeavesPayThisMonth: Math.ceil(totalPublicLeavesPayThisMonth),
      totalSalaryThisMonth: Math.ceil(totalSalaryThisMonth),
      user: user?.id,
    });

    const invoice = await newInvoice.save();

    await User.findByIdAndUpdate(user?.id, {
      $push: { invoices: newInvoice._id },
    });

    const updatedInvoice = transformInvoice(invoice);

    return APIResponse.success(
      res,
      "Invoice created successfully",
      { invoice: updatedInvoice },
      StatusCodes.CREATED
    );
  } catch (error) {
    console.error("Error creating Invoice:", error);
    return APIResponse.error(
      res,
      "An error occurred while creating Invoice",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
export const getAllInvoices = async (req: IUserRequest, res: Response) => {
  const user = req.user;
  try {
    // Pagination parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    if (page < 1 || limit < 1) {
      return APIResponse.error(
        res,
        "Invalid pagination parameters",
        StatusCodes.BAD_REQUEST
      );
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    const totalCount = await Invoice.countDocuments({ user: user?.id });

    const invoice = await Invoice.find({ user: user?.id })
      .select("-__v -password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Sort by creation date, newest first

    if (!invoice || invoice.length === 0) {
      return APIResponse.success(
        res,
        "No Invoice records found",
        [],
        StatusCodes.OK
      );
    }

    // Prepare pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    const paginationInfo = {
      currentPage: page,
      totalPages,
      totalRecords: totalCount,
      hasNextPage,
      hasPrevPage,
    };

    const updatedInvoice = transformInvoicesArray(invoice);

    return APIResponse.success(
      res,
      "Invoice records retrieved successfully",
      { invoice: updatedInvoice, pagination: paginationInfo },
      StatusCodes.OK
    );
  } catch (error) {
    console.error("Error fetching Invoices:", error);
    return APIResponse.error(
      res,
      "An error occurred while fetching Invoices",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
export const getSingleInvoice = async (req: Request, res: Response) => {
  try {
    const invoiceId = req.query.invoiceId as string;
    if (!invoiceId) {
      return APIResponse.error(
        res,
        "Invoice Id is required",
        StatusCodes.BAD_REQUEST
      );
    }
    console.log(invoiceId);

    // Find the salary record for the user
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return APIResponse.error(
        res,
        "Invoice record not found ",
        StatusCodes.NOT_FOUND
      );
    }
    const updatedInvoice = transformInvoice(invoice);

    return APIResponse.success(
      res,
      " Invoice retrieved successfully",
      { invoice: updatedInvoice },
      StatusCodes.OK
    );
  } catch (error) {
    console.error("Error fetching Invoice:", error);
    return APIResponse.error(
      res,
      "An error occurred while fetching Invoice",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
export const updateInvoice = async (req: Request, res: Response) => {
  try {
    const invoiceId = req.query.invoiceId as string;
    console.log(invoiceId);
    const {
      basicPay,
      committedHours,
      workingHours,
      publiceLeaves,
      publicLeaveWorkingHour,
      PaidLeavesformonth,
      requiredHoursThisMonth,
      overTimeHours,
      basicPayPerHourThisMonth,
      overTimePayPerHourThisMonth,
      publicHoursPayPerHourThisMonth,
      totalBasicSalaryThisMonth,
      overTimePayThisMonth,
      totalPublicLeavesPayThisMonth,
      totalSalaryThisMonth,
      user: userId,
    } = req.body;

    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return APIResponse.error(
        res,
        " Invoice not found ",
        StatusCodes.NOT_FOUND
      );
    }

    (invoice.basicPay = basicPay),
      (invoice.committedHours = committedHours),
      (invoice.workingHours = workingHours),
      (invoice.publiceLeaves = publiceLeaves),
      (invoice.publicLeaveWorkingHour = publicLeaveWorkingHour),
      (invoice.PaidLeavesformonth = PaidLeavesformonth),
      (invoice.requiredHoursThisMonth = requiredHoursThisMonth),
      (invoice.overTimeHours = overTimeHours),
      (invoice.basicPayPerHourThisMonth = basicPayPerHourThisMonth),
      (invoice.overTimePayPerHourThisMonth = overTimePayPerHourThisMonth),
      (invoice.publicHoursPayPerHourThisMonth = publicHoursPayPerHourThisMonth),
      (invoice.totalBasicSalaryThisMonth = totalBasicSalaryThisMonth),
      (invoice.overTimePayThisMonth = overTimePayThisMonth),
      (invoice.totalPublicLeavesPayThisMonth = totalPublicLeavesPayThisMonth),
      (invoice.totalSalaryThisMonth = totalSalaryThisMonth),
      (invoice.user = userId),
      await invoice.save();

    const updatedInvoice = transformInvoice(invoice);

    return APIResponse.success(
      res,
      "Invoice  updated successfully",
      { invoice: updatedInvoice },
      StatusCodes.OK
    );
  } catch (error) {
    console.error("Error updating Invoice:", error);
    return APIResponse.error(
      res,
      "An error occurred while updating Invoice",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
export const deleteInvoice = async (req: Request, res: Response) => {
  try {
    const { invoiceId } = req.query;

    // Find the user
    const user = await Invoice.findById(invoiceId);
    if (!user) {
      return APIResponse.error(res, "Invoice not found", StatusCodes.NOT_FOUND);
    }

    // Find the salary record for the user
    const invoice = await Invoice.findById(invoiceId);

    if (!invoice) {
      return APIResponse.error(res, "Invoice not found", StatusCodes.NOT_FOUND);
    }

    // Delete the salary record
    await invoice.deleteOne();

    const updatedInvoice = transformInvoice(invoice);

    return APIResponse.success(
      res,
      " Invoice deleted successfully",
      { invoice: updatedInvoice },
      StatusCodes.OK
    );
  } catch (error) {
    console.error("Error deleting Invoice:", error);
    return APIResponse.error(
      res,
      "An error occurred while deleting Invoice",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
