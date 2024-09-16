import mongoose from "mongoose";

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  salary: mongoose.Types.ObjectId[]; // Store form IDs
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

  salary: [{ type: mongoose.Schema.Types.ObjectId, ref: "Salary" }],
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;
