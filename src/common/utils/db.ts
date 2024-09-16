import { env } from "./envConfig";
import mongoose from "mongoose";

mongoose
  .connect(env.MONGO_URL as string)
  .then(() => {
    console.log("Connected to Mongo DB");
  })
  .catch((err) => {
    console.log(err);
  });
