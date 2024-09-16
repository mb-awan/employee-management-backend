import { env } from "../common/utils/envConfig";
import mongoose from "mongoose";
import seedUsers from "./userseed";
const { MONGO_URL } = env;

const seedDatabase = async () => {
  mongoose
    .connect(MONGO_URL as string)
    .then(async () => {
      console.log("Connected to Mongo DB");
      await seedUsers();
    })
    .catch((err) => {
      console.log("Something went wrong while seeding"), JSON.stringify(err);
    })
    .finally(() => {
      mongoose.connection.close();
    });
};

seedDatabase();
