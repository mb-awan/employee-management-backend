import mongoose from "mongoose";
import { string } from "zod";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const SalarySchema = new mongoose.Schema({
  basicPay: {
    type: Number,
    required: true,
  },
  committedHours: {
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

  month: {
    type: String,
    default: () => months[new Date().getMonth()],
  },

  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Salary = mongoose.model("Salary", SalarySchema);
export default Salary;
