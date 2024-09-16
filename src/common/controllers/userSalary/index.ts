import mongoose from "mongoose";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { APIResponse } from "../../utils/response";
import Salary from "../../models/userSalary";
import User from "../../models/user";
import { log } from "console";
import { IUserRequest } from "../../utils/authenticate";
export const createUserSalary = async (req: IUserRequest, res: Response) => {
  const userId = req.id;
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
      overTimepayPerHourThisMonth,
      publicHoursPayPerHourThisMonth,
      totalBasicSalaryThisMonth,
      overTimePayThisMonth,
      totalPublicLeavesPayThisMonth,
      totalSalaryThisMonth,
    } = req.body;

    console.log(req.body);

    const existingSalary = await Salary.findOne({
      basicPay,
      committedHours,
      workingHours,
      publiceLeaves,
      publicLeaveWorkingHour,
      PaidLeavesformonth,
      requiredHoursThisMonth,
      overTimeHours,
      basicPayPerHourThisMonth,
      overTimepayPerHourThisMonth,
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
    const newUserSalary = new Salary({
      basicPay,
      committedHours,
      workingHours,
      publiceLeaves,
      publicLeaveWorkingHour,
      PaidLeavesformonth,
      requiredHoursThisMonth,
      overTimeHours,
      basicPayPerHourThisMonth,
      overTimepayPerHourThisMonth,
      publicHoursPayPerHourThisMonth,
      totalBasicSalaryThisMonth,
      overTimePayThisMonth,
      totalPublicLeavesPayThisMonth,
      totalSalaryThisMonth,
      user: userId,
    });

    // Save the new user salary
    const savedUserSalary = await newUserSalary.save();

    await User.findByIdAndUpdate(userId, {
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
  const userId = req.id;
  console.log(req.id);
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
    const totalCount = await Salary.countDocuments({ user: userId });

    // Fetch salary records with pagination
    const salaries = await Salary.find({ user: userId })
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
    const userId = req.query.userId as string;
    if (!userId) {
      return APIResponse.error(
        res,
        "User ID is required",
        StatusCodes.BAD_REQUEST
      );
    }
    console.log(userId);

    // Validate userId
    if (
      !userId ||
      typeof userId !== "string" ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return APIResponse.error(res, "Invalid user ID", StatusCodes.BAD_REQUEST);
    }

    // Find the salary record for the user
    const salary = await Salary.findById(userId);
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
      { salary },
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
    const { userId } = req.query;
    //   console.log(req.params.id)
    console.log(userId);
    const {
      basicPay,
      committedHours,
      workingHours,
      publicLeaveWorkingHour,
      overTimeHours,
      overTimePayThisMonth,
      publicHoursPayThisMonth,
      totalSalaryThisMonth,
    } = req.body;

    // Validate userId
    if (
      !userId ||
      typeof userId !== "string" ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return APIResponse.error(res, "Invalid user ID", StatusCodes.BAD_REQUEST);
    }

    // Find the user
    const user = await Salary.findById(userId);
    if (!user) {
      return APIResponse.error(res, "User not found", StatusCodes.NOT_FOUND);
    }

    // Find the salary record for the user
    const salary = await Salary.findById(userId);
    if (!salary) {
      return APIResponse.error(
        res,
        "Salary record not found for this user",
        StatusCodes.NOT_FOUND
      );
    }

    // Update the salary record
    salary.basicPay = basicPay;
    salary.committedHours = committedHours;
    salary.workingHours = workingHours;
    salary.publicLeaveWorkingHour = publicLeaveWorkingHour;
    salary.overTimeHours = overTimeHours;
    salary.overTimePayThisMonth = overTimeHours;
    // salary.publicHoursPayThisMonth = publicHoursPayThisMonth;
    salary.totalSalaryThisMonth = totalSalaryThisMonth;
    await salary.save();
    return APIResponse.success(
      res,
      "Salary record updated successfully",
      { salary },
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
    const { userId } = req.query;
    // Validate userId
    if (
      !userId ||
      typeof userId !== "string" ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return APIResponse.error(res, "Invalid user ID", StatusCodes.BAD_REQUEST);
    }
    // Find the user
    const user = await Salary.findById(userId);
    if (!user) {
      return APIResponse.error(res, "User not found", StatusCodes.NOT_FOUND);
    }

    // Find the salary record for the user
    const salary = await Salary.findById(userId);
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
