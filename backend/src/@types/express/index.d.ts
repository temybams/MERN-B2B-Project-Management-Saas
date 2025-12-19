import "express";
import { UserDocument } from "../../models/user.model";

declare global {
  namespace Express {
    interface User extends UserDocument {
      _id: string;
    }

    interface Request {
      user?: User;

      logIn(
        user: User,
        done: (err?: any) => void
      ): void;

      logOut(
        done: (err?: any) => void
      ): void;
    }
  }
}

export {};
