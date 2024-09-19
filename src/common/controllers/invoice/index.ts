import mongoose from "mongoose";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { APIResponse } from "../../utils/response";
import User from "../../models/user";
import { log } from "console";
import { IUserRequest } from "../../utils/types";
import Invoice from "../../models/invoice";
export const createUserSalary = async (req: IUserRequest, res: Response) => {
  const user = req.user;
  console.log(req.user?.username);
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

    const existingSalary = await Invoice.findOne({
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

    if (existingSalary) {
      return APIResponse.error(
        res,
        "Duplicate  data found",
        StatusCodes.CONFLICT
      );
    }

    // check all feild are required

    if (!basicPay || !committedHours || !workingHours) {
      return APIResponse.error(
        res,
        "All fields are required",
        StatusCodes.CONFLICT
      );
    }

    // Create new user salary
    const newUserSalary = new Invoice({
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

    // Save the new user salary
    const savedUserSalary = await newUserSalary.save();

    await User.findByIdAndUpdate(user?.id, {
      $push: { salary: newUserSalary._id },
    });

    return APIResponse.success(
      res,
      "User salary created successfully",
      savedUserSalary,
      StatusCodes.CREATED
    );
  } catch (error) {
    console.error("Error creating user salary:", error);
    return APIResponse.error(
      res,
      "An error occurred while creating user salary",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
export const getAllUsersSalary = async (req: IUserRequest, res: Response) => {
  const user = req.user;
  console.log(req.user);
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

    // Fetch total count of salary records
    const totalCount = await Invoice.countDocuments({ user: user?.id });

    // Fetch salary records with pagination
    const salaries = await Invoice.find({ user: user?.id })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Sort by creation date, newest first

    if (!salaries || salaries.length === 0) {
      return APIResponse.success(
        res,
        "No salary records found",
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

    return APIResponse.success(
      res,
      "Salary records retrieved successfully",
      { salaries, pagination: paginationInfo },
      StatusCodes.OK
    );
  } catch (error) {
    console.error("Error fetching all user salaries:", error);
    return APIResponse.error(
      res,
      "An error occurred while fetching user salaries",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
export const getsingleUserSalary = async (req: Request, res: Response) => {
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

    // Validate userId
    if (
      !invoiceId ||
      typeof invoiceId !== "string" ||
      !mongoose.Types.ObjectId.isValid(invoiceId)
    ) {
      return APIResponse.error(res, "Invalid user ID", StatusCodes.BAD_REQUEST);
    }

    // Find the salary record for the user
    const salary = await Invoice.findById(invoiceId);
    if (!salary) {
      return APIResponse.error(
        res,
        "Salary record not found for this user",
        StatusCodes.NOT_FOUND
      );
    }

    return APIResponse.success(
      res,
      "User salary retrieved successfully",
      { invoice: salary },
      StatusCodes.OK
    );
  } catch (error) {
    console.error("Error fetching single user salary:", error);
    return APIResponse.error(
      res,
      "An error occurred while fetching user salary",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
export const updateUserSalary = async (req: Request, res: Response) => {
  try {
    const { invoiceId } = req.query;
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

    // Validate userId
    if (
      !invoiceId ||
      typeof invoiceId !== "string" ||
      !mongoose.Types.ObjectId.isValid(invoiceId)
    ) {
      return APIResponse.error(res, "Invalid user ID", StatusCodes.BAD_REQUEST);
    }

    // Find the salary record for the user
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return APIResponse.error(
        res,
        "Salary record not found for this user",
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
    return APIResponse.success(
      res,
      "Salary record updated successfully",
      { invoice },
      StatusCodes.OK
    );
  } catch (error) {
    console.error("Error updating user salary:", error);
    return APIResponse.error(
      res,
      "An error occurred while updating user salary",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
export const deleteUserSalary = async (req: Request, res: Response) => {
  try {
    const { invoiceId } = req.query;
    // Validate userId
    if (
      !invoiceId ||
      typeof invoiceId !== "string" ||
      !mongoose.Types.ObjectId.isValid(invoiceId)
    ) {
      return APIResponse.error(res, "Invalid user ID", StatusCodes.BAD_REQUEST);
    }
    // Find the user
    const user = await Invoice.findById(invoiceId);
    if (!user) {
      return APIResponse.error(res, "User not found", StatusCodes.NOT_FOUND);
    }

    // Find the salary record for the user
    const salary = await Invoice.findById(invoiceId);
    if (!salary) {
      return APIResponse.error(
        res,
        "Salary record not found for this user",
        StatusCodes.NOT_FOUND
      );
    }

    // Delete the salary record
    await salary.deleteOne();
    return APIResponse.success(
      res,
      "Salary record deleted successfully",
      StatusCodes.OK
    );
  } catch (error) {
    console.error("Error deleting user salary:", error);
    return APIResponse.error(
      res,
      "An error occurred while deleting user salary",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
