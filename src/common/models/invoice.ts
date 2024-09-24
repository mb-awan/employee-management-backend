import mongoose from "mongoose";
import { MODEL_NAMES } from "./constants";

const InvoicesSchema = new mongoose.Schema({
  basicPayForThisMonth: {
    type: Number,
    required: true,
  },
  committedHoursForThisMonth: {
    type: Number,
    required: true,
  },
  workingHoursForThisMonth: {
    type: Number,
    required: true,
  },
  publiceLeavesForThisMonth: {
    type: Number,
  },
  publiceLeaveWorkingHourForThisMonth: {
    type: Number,
  },
  paidLeavesForThisMonth: {
    type: Number,
  },
  requiredTotalHoursForThisMonth: {
    type: Number,
  },

  overTimeHoursForThisMonth: {
    type: Number,
  },

  basicPayPerHourForThisMonth: {
    type: Number,
  },

  overTimePayPerHourForThisMonth: {
    type: Number,
  },

  publiceLeavesPayPerHourForThisMonth: {
    type: Number,
  },

  totalBasicSalaryForThisMonth: {
    type: Number,
  },

  overTimePayForThisMonth: {
    type: Number,
  },

  totalPublicLeavesPayForThisMonth: {
    type: Number,
  },

  totalSalaryForThisMonth: {
    type: Number,
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

  year: {
    type: Number,
    default: () => {
      const currentDate = new Date();
      return currentDate.getFullYear();
    },
  },

  slug: {
    type: String,
    default: () => {
      const currentDate = new Date();
      const options: Intl.DateTimeFormatOptions = {
        month: "short",
        year: "2-digit",
      };
      const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
        currentDate
      );
      return formattedDate.replace(" ", "-");
    },
  },

  user: { type: mongoose.Schema.Types.ObjectId, ref: MODEL_NAMES.User },
});

const Invoice = mongoose.model(MODEL_NAMES.Invoice, InvoicesSchema);
export default Invoice;
