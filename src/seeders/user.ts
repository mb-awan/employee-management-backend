import User from "../common/models/user";
import { users } from "./data/users";
import { hashPassword } from "../common/utils/auth"; // Assuming you have this utility function

const seedUsers = async () => {
  try {
    console.log("Seeding users...");

    await Promise.all(
      users.map(async (user) => {
        let userData = { ...user };
        userData.password = await hashPassword(user.password);

        // Upsert user (create if doesn't exist, otherwise update)
        return User.findOneAndUpdate(
          { email: user.email },
          { ...userData },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      })
    );

    console.log("Users seeded!");
  } catch (err) {
    console.log("Error seeding users:", err);
    throw new Error("Something went wrong while seeding users");
  }
};

export default seedUsers;
