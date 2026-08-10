import { Request } from "express";
import { Types } from "mongoose";

export type RequestUser = {
  _id: string;
  name: string;
  email: string;
  profilePicture: string | null;
  isActive: boolean;
  lastLogin: Date | null;
  currentWorkspace: Types.ObjectId | string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type RequestWithUser = Request & {
  user?: RequestUser;
};