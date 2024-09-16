import { z } from "zod";

export const salarySchema = z.object({
  basicPay: z.number().nonnegative("Invalid Basic Pay"),
  committedHours: z.number().nonnegative("Invalid Total Hours"),
  workingHours: z.number().nonnegative("Invalid Working Hours"),
  publicLeaves: z.number().nonnegative().optional(),
  publicLeaveWorkingHour: z.number().nonnegative().optional(),
  PaidLeavesformonth: z.number().nonnegative().optional(),
});
