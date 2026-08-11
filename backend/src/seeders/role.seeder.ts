import "dotenv/config";
import mongoose from "mongoose";
import connectDatabase from "../config/db.Config";
import RoleModel from "../models/roles-permission.model";
import { RolePermissions } from "../utils/role-permission";

const seedRoles = async () => {
  console.log("Seeding roles started...");

  try {
    await connectDatabase();

    const session = await mongoose.startSession();
    session.startTransaction();

    for (const roleName in RolePermissions) {
      const role = roleName as keyof typeof RolePermissions;
      const permissions = RolePermissions[role];

      // Preserve role IDs so existing memberships never become orphaned.
      await RoleModel.updateOne(
        { name: role },
        { $set: { permissions } },
        { upsert: true, session }
      );
      console.log(`Role ${role} synchronized.`);
    }

    await session.commitTransaction();
    console.log("Transaction committed.");

    session.endSession();
    console.log("Session ended.");

    console.log("Seeding completed successfully.");
  } catch (error) {
    console.error("Error during seeding:", error);
  }
};

seedRoles().catch((error) =>
  console.error("Error running seed script:", error)
);
