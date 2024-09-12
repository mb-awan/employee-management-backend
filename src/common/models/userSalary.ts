// salary.model.js
import mongoose from "mongoose";
const SalarySchema = new mongoose.Schema({
  basicPay: {
    type: Number,
    required: true,
  },
  totalHours: {
    type: Number,
    required: true,
  },
  workingHours: {
    type: Number,
    required: true,
  },
  publiceLeaves: {
    type: Number,
  },
  publicLeaveWorkingHour: {
    type: Number,
  },
  PaidLeavesformonth: {
    type: Number,
  },
  requiredHoursThisMonth: {
    type: Number,
    required: true,
  },

  overTimeHours: {
    type: Number,
    required: true,
  },

  basicPayPerHourThisMonth: {
    type: Number,
    required: true,
  },

  overTimepayPerHourThisMonth: {
    type: Number,
    required: true,
  },

  publicHoursPayPerHourThisMonth: {
    type: Number,
    required: true,
  },

  totalBasicSalaryThisMonth: {
    type: Number,
    required: true,
  },

  overTimePayThisMonth: {
    type: Number,
    required: true,
  },

  totalPublicLeavesPayThisMonth: {
    type: Number,
    required: true,
  },

  totalSalaryThisMonth: {
    type: Number,
    required: true,
  },

  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Salary = mongoose.model("Salary", SalarySchema);
export default Salary;
