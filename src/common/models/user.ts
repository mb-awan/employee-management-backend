import mongoose from "mongoose";
import { MODEL_NAMES } from "./constants";

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  invoices: mongoose.Types.ObjectId[]; // Store form IDs
}

const userSchema = new mongoose.Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },

  invoices: [
    { type: mongoose.Schema.Types.ObjectId, ref: MODEL_NAMES.Invoice },
  ],
});

const User = mongoose.model<IUser>(MODEL_NAMES.User, userSchema);
export default User;
