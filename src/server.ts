import "./common/utils/db";
import express from "express";
const app = express();
import dotenv from "dotenv";
import cors from "cors";
import { invoiceRoutes } from "./api/invoice/invoiceRoute";
import { authRoutes } from "./api/auth/authRoute";
import { apiRoutes } from "./common/constants/common";
import { openAPIRouter } from "./api-docs/openAPIRouter";
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(apiRoutes.auth, authRoutes);
app.use(apiRoutes.invoice, invoiceRoutes);

app.use(openAPIRouter);

export { app };
