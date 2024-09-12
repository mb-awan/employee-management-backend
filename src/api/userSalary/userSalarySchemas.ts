import { z } from "zod";

export const salarySchema = z.object({
  basicPay: z.number().min(0),
  totalHours: z.number().min(0),
  workingHours: z.number().min(0),
});
