import { Types } from "mongoose";

export interface IAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface IPermissions {
  id: string;
  name: string;
  description: string;
}

export interface IUser {
  id: string;
}

export interface IUserDoc extends IUser, Document {
  password: string;
  emailVerificationOTP: string | null;
  phoneVerificationOTP: string | null;
  forgotPasswordOTP: string | null;
  passwordUpdateRequested: boolean;
  accessToken: string | null;
  TFAEnabled: boolean;
  TFAOTP: string | null;
}
