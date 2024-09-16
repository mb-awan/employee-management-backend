import "./common/utils/db";
import express from "express";
const app = express();
import dotenv from "dotenv";
import cors from "cors";
import { userSalaryRoutes } from "./api/userSalary/userSalaryRoute";
import { userRoutes } from "./api/user/userRoute";
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/salary", userSalaryRoutes);
app.use("/user", userRoutes);

export { app };
