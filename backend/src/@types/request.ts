import { Request } from "express";
import { Types } from "mongoose";
import  { UserDocument }  from "../models/user.model";

export type RequestUser = Omit<UserDocument, "password"> & { _id: Types.ObjectId };

export type RequestWithUser = Request & {
  user?: RequestUser;
};
