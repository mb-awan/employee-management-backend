import { Request } from "express";
import { IInvoiceCalculationResult } from "../types/invoice";

// export interface IUserRequest extends Request {
//   user?: {
//     id: string;
//     username: string;
//   };
// }

// export interface Invoice extends Request {
//   invoiceData?: IInvoiceCalculationResult;
// }

export interface CustomRequest extends Request {
  user?: {
    id: string;
    username: string;
  };
  invoiceData?: IInvoiceCalculationResult;
}
