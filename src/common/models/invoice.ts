import mongoose from "mongoose";
import { MODEL_NAMES } from "./constants";

const InvoicesSchema = new mongoose.Schema({
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

  overTimePayPerHourThisMonth: {
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
    default: () => {
      const currentDate = new Date();
      return new Intl.DateTimeFormat("en-US", { month: "long" }).format(
        currentDate
      );
    },
  },

  user: { type: mongoose.Schema.Types.ObjectId, ref: MODEL_NAMES.User },
});

const Invoice = mongoose.model(MODEL_NAMES.Invoice, InvoicesSchema);
export default Invoice;
