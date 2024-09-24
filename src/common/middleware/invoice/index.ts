import express, { Request, Response, NextFunction } from "express";
import { APIResponse } from "../../utils/response";
import { StatusCodes } from "http-status-codes";
import { IInvoiceCalculationResult } from "../../types/invoice";
import { CustomRequest } from "../../utils/types";
import Invoice from "../../models/invoice";

const app = express();

export const calculateInvoiceMiddleware = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      basicPayForThisMonth,
      committedHoursForThisMonth,
      workingHoursForThisMonth,
      publiceLeavesForThisMonth,
      publiceLeaveWorkingHourForThisMonth,
      paidLeavesForThisMonth,
    } = req.body;

    const oneDayHours = committedHoursForThisMonth / 20 || 0; // Default to 0 to avoid division by zero
    const publicLeavesInHours = publiceLeavesForThisMonth * oneDayHours;
    const requiredTotalHoursThisMonth =
      committedHoursForThisMonth - publicLeavesInHours;

    const basicPayPerHourForThisMonth =
      requiredTotalHoursThisMonth > 0
        ? basicPayForThisMonth / requiredTotalHoursThisMonth
        : 0; // Handle division by zero

    const overTimePayPerHourForThisMonth = basicPayPerHourForThisMonth * 1.5;
    const publicLeavesPayPerHourForThisMonth = basicPayPerHourForThisMonth * 2;

    const overTimeHoursForThisMonth =
      workingHoursForThisMonth > requiredTotalHoursThisMonth
        ? workingHoursForThisMonth -
          requiredTotalHoursThisMonth -
          publiceLeaveWorkingHourForThisMonth
        : 0;

    const basicPayThisMonth =
      requiredTotalHoursThisMonth <= workingHoursForThisMonth
        ? basicPayPerHourForThisMonth * requiredTotalHoursThisMonth
        : basicPayPerHourForThisMonth * workingHoursForThisMonth;

    const overTimePayThisMonth =
      overTimePayPerHourForThisMonth * overTimeHoursForThisMonth;

    const totalPublicLeavesPayForThisMonth = publiceLeaveWorkingHourForThisMonth
      ? basicPayPerHourForThisMonth * 2 * publiceLeaveWorkingHourForThisMonth
      : 0;

    const totalSalaryForThisMonth =
      basicPayThisMonth +
      overTimePayThisMonth +
      totalPublicLeavesPayForThisMonth;

    // Replace NaN and Infinity with 0
    const safeValue = (value: number) =>
      isNaN(value) || !isFinite(value) ? 0 : value;

    // Build the result object
    const result: IInvoiceCalculationResult = {
      requiredTotalHoursThisMonth: Math.ceil(
        safeValue(requiredTotalHoursThisMonth)
      ),
      basicPayPerHourForThisMonth: Math.ceil(
        safeValue(basicPayPerHourForThisMonth)
      ),
      overTimePayPerHourForThisMonth: Math.ceil(
        safeValue(overTimePayPerHourForThisMonth)
      ),
      publiceLeavesPayPerHourForThisMonth: Math.ceil(
        safeValue(publicLeavesPayPerHourForThisMonth)
      ),
      overTimeHoursForThisMonth: Math.ceil(
        safeValue(overTimeHoursForThisMonth)
      ),
      overTimePayThisMonth: Math.ceil(safeValue(overTimePayThisMonth)),
      totalPublicLeavesPayForThisMonth: Math.ceil(
        safeValue(totalPublicLeavesPayForThisMonth)
      ),
      totalSalaryForThisMonth: Math.ceil(safeValue(totalSalaryForThisMonth)),
      paidLeavesForThisMonth: Math.ceil(safeValue(paidLeavesForThisMonth)),
      basicPayForThisMonth: Math.ceil(safeValue(basicPayForThisMonth)),
      committedHoursForThisMonth: Math.ceil(
        safeValue(committedHoursForThisMonth)
      ),
      workingHoursForThisMonth: Math.ceil(safeValue(workingHoursForThisMonth)),
      publiceLeavesForThisMonth: Math.ceil(
        safeValue(publiceLeavesForThisMonth)
      ),
      publiceLeaveWorkingHourForThisMonth: Math.ceil(
        safeValue(publiceLeaveWorkingHourForThisMonth)
      ),
      totalBasicSalaryForThisMonth: Math.ceil(safeValue(basicPayForThisMonth)),
    };

    req.invoiceData = result;
    console.log(req.invoiceData);
    next();
  } catch (error) {
    return APIResponse.error(
      res,
      "Error in Sending to Data",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const updateCalculateInvoiceMiddleware = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const invoiceId = req.query.invoiceId as string;
    console.log(invoiceId);

    const invoice = await Invoice.findById(invoiceId);

    if (!invoice) {
      return APIResponse.error(res, "Invoice not found", StatusCodes.NOT_FOUND);
    }

    const {
      basicPayForThisMonth = req.body.basicPayForThisMonth ||
        invoice.basicPayForThisMonth,
      committedHoursForThisMonth = req.body.committedHoursForThisMonth ||
        invoice.committedHoursForThisMonth,
      workingHoursForThisMonth = req.body.workingHoursForThisMonth ||
        invoice.workingHoursForThisMonth,
      publiceLeavesForThisMonth = req.body.publiceLeavesForThisMonth ||
        invoice.publiceLeavesForThisMonth,
      publiceLeaveWorkingHourForThisMonth = req.body
        .publiceLeaveWorkingHourForThisMonth ||
        invoice.publiceLeaveWorkingHourForThisMonth,
      paidLeavesForThisMonth = req.body.paidLeavesForThisMonth ||
        invoice.paidLeavesForThisMonth,
    } = req.body;

    const oneDayHours = committedHoursForThisMonth / 20 || 0; // Default to 0 to avoid division by zero
    const publicLeavesInHours = publiceLeavesForThisMonth * oneDayHours;
    const requiredTotalHoursThisMonth =
      committedHoursForThisMonth - publicLeavesInHours;

    const basicPayPerHourForThisMonth =
      requiredTotalHoursThisMonth > 0
        ? basicPayForThisMonth / requiredTotalHoursThisMonth
        : 0; // Handle division by zero

    const overTimePayPerHourForThisMonth = basicPayPerHourForThisMonth * 1.5;
    const publicLeavesPayPerHourForThisMonth = basicPayPerHourForThisMonth * 2;

    const overTimeHoursForThisMonth =
      workingHoursForThisMonth > requiredTotalHoursThisMonth
        ? workingHoursForThisMonth -
          requiredTotalHoursThisMonth -
          publiceLeaveWorkingHourForThisMonth
        : 0;

    const basicPayThisMonth =
      requiredTotalHoursThisMonth <= workingHoursForThisMonth
        ? basicPayPerHourForThisMonth * requiredTotalHoursThisMonth
        : basicPayPerHourForThisMonth * workingHoursForThisMonth;

    const overTimePayThisMonth =
      overTimePayPerHourForThisMonth * overTimeHoursForThisMonth;

    const totalPublicLeavesPayForThisMonth = publiceLeaveWorkingHourForThisMonth
      ? basicPayPerHourForThisMonth * 2 * publiceLeaveWorkingHourForThisMonth
      : 0;

    const totalSalaryForThisMonth =
      basicPayThisMonth +
      overTimePayThisMonth +
      totalPublicLeavesPayForThisMonth;

    // Replace NaN and Infinity with 0
    const safeValue = (value: number) =>
      isNaN(value) || !isFinite(value) ? 0 : value;

    // Build the result object
    const result: IInvoiceCalculationResult = {
      requiredTotalHoursThisMonth: Math.ceil(
        safeValue(requiredTotalHoursThisMonth)
      ),
      basicPayPerHourForThisMonth: Math.ceil(
        safeValue(basicPayPerHourForThisMonth)
      ),
      overTimePayPerHourForThisMonth: Math.ceil(
        safeValue(overTimePayPerHourForThisMonth)
      ),
      publiceLeavesPayPerHourForThisMonth: Math.ceil(
        safeValue(publicLeavesPayPerHourForThisMonth)
      ),
      overTimeHoursForThisMonth: Math.ceil(
        safeValue(overTimeHoursForThisMonth)
      ),
      overTimePayThisMonth: Math.ceil(safeValue(overTimePayThisMonth)),
      totalPublicLeavesPayForThisMonth: Math.ceil(
        safeValue(totalPublicLeavesPayForThisMonth)
      ),
      totalSalaryForThisMonth: Math.ceil(safeValue(totalSalaryForThisMonth)),
      paidLeavesForThisMonth: Math.ceil(safeValue(paidLeavesForThisMonth)),
      basicPayForThisMonth: Math.ceil(safeValue(basicPayForThisMonth)),
      committedHoursForThisMonth: Math.ceil(
        safeValue(committedHoursForThisMonth)
      ),
      workingHoursForThisMonth: Math.ceil(safeValue(workingHoursForThisMonth)),
      publiceLeavesForThisMonth: Math.ceil(
        safeValue(publiceLeavesForThisMonth)
      ),
      publiceLeaveWorkingHourForThisMonth: Math.ceil(
        safeValue(publiceLeaveWorkingHourForThisMonth)
      ),
      totalBasicSalaryForThisMonth: Math.ceil(safeValue(basicPayForThisMonth)),
    };

    req.invoiceData = result;
    console.log(req.invoiceData);
    next();
  } catch (error) {
    return APIResponse.error(
      res,
      "Error in Sending to Data",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
