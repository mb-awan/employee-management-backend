import mongoose from "mongoose";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { APIResponse } from "../../utils/response";
import User from "../../models/user";
import { log } from "console";
import Invoice from "../../models/invoice";

import { invoicePaths } from "../../../api/invoice/invoiceRoute";
import {
  transformInvoice,
  transformInvoicesArray,
} from "../../utils/transformResoonse";
import { CustomRequest } from "../../utils/types";
export const createInvoice = async (req: CustomRequest, res: Response) => {
  try {
    const user = req.user;
    const invoiceData = req.invoiceData;
    console.log(invoiceData);

    const newInvoice = new Invoice({
      ...invoiceData,
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
export const getAllInvoices = async (req: CustomRequest, res: Response) => {
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
export const updateInvoice = async (req: CustomRequest, res: Response) => {
  try {
    const invoiceId = req.query.invoiceId as string;
    const invoiceData = req.invoiceData;

    const updateData = {
      basicPayForThisMonth: invoiceData?.basicPayForThisMonth,
      committedHoursForThisMonth: invoiceData?.committedHoursForThisMonth,
      workingHoursForThisMonth: invoiceData?.workingHoursForThisMonth,
      publiceLeavesForThisMonth: invoiceData?.publiceLeavesForThisMonth,
      publicLeaveWorkingHourForThisMonth:
        invoiceData?.publiceLeaveWorkingHourForThisMonth,
      paidLeavesForThisMonth: invoiceData?.paidLeavesForThisMonth,
      totalSalaryForThisMonth: invoiceData?.totalSalaryForThisMonth,
      overTimePayThisMonth: invoiceData?.overTimePayThisMonth,
      totalPublicLeavesPayForThisMonth:
        invoiceData?.totalPublicLeavesPayForThisMonth,
      overTimeHoursForThisMonth: invoiceData?.overTimeHoursForThisMonth,
      requiredTotalHoursThisMonth: invoiceData?.requiredTotalHoursThisMonth,
      basicPayPerHourForThisMonth: invoiceData?.basicPayPerHourForThisMonth,
      overTimePayPerHourForThisMonth:
        invoiceData?.overTimePayPerHourForThisMonth,
      publicLeavesPayPerHourForThisMonth:
        invoiceData?.publiceLeavesPayPerHourForThisMonth,
    };
    const updatedUser = await Invoice.findByIdAndUpdate(invoiceId, updateData, {
      new: true, // Return the updated document
    });

    if (!updatedUser) {
      return APIResponse.error(res, "User not found", StatusCodes.NOT_FOUND);
    }

    const invoice = transformInvoice(updatedUser);

    // Return success response with updated data
    return APIResponse.success(
      res,
      "User updated successfully",
      invoice,
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
