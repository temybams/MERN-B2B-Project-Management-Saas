import { Response } from "express";
import { asyncHandler } from "../middlewares/async.Middleware";
import { HTTPSTATUS } from "../config/http.config";
import { getCurrentUserService } from "../services/user.service";
import {RequestWithUser} from "../@types/request";

export const getCurrentUserController = asyncHandler(
  async (req:RequestWithUser, res: Response) => {
    const userId = req.user?._id!;

    const { user } = await getCurrentUserService(userId);

    return res.status(HTTPSTATUS.OK).json({
      message: "User fetch successfully",
      user,
    });
  }
);
