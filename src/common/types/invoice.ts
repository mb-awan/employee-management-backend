// Define the types for the request body
export interface IInvoiceFormValues {
  basicPay: number;
  committedHours: number;
  workingHours: number;
  publiceLeaves: number;
  publicLeaveWorkingHour: number;
  PaidLeavesformonth: number;
}

// Define the return type for salary calculation
export interface IInvoiceCalculationResult {
  requiredTotalHoursThisMonth: number;
  basicPayPerHourForThisMonth: number;
  overTimePayPerHourForThisMonth: number;
  publiceLeavesPayPerHourForThisMonth: number;
  overTimeHoursForThisMonth: number;
  overTimePayThisMonth: number;
  totalPublicLeavesPayForThisMonth: number;
  totalSalaryForThisMonth: number;
  paidLeavesForThisMonth: number;
  basicPayForThisMonth: number;
  committedHoursForThisMonth: number;
  workingHoursForThisMonth: number;
  publiceLeavesForThisMonth: number;
  publiceLeaveWorkingHourForThisMonth: number;
  totalBasicSalaryForThisMonth: number;
}
