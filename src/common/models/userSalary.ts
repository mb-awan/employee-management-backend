// salary.model.js
import mongoose from 'mongoose';
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
  publicLeaveWorkingHour: {
    type: Number,
    required: true,
  },
  overTimeHours: {
    type: Number,
    required: true,
  },
  overTimePayThisMonth: {
    type: Number,
    required: true,
  },
  publicHoursPayThisMonth: {
    type: Number,
    required: true,
  },
  totalSalaryThisMonth: {
    type: Number,
    required: true,
  },
});

const Salary = mongoose.model('Salary', SalarySchema);
export default Salary;
