import { RequestHandler } from "express";
import { UnauthorizedException } from "../utils/appErrors";
import { RequestWithUser } from "../@types/request";

const isAuthenticated: RequestHandler = (req, res, next) => {
  const userReq = req as RequestWithUser;
  if (!userReq.user || !userReq.user._id) {
    throw new UnauthorizedException("Unauthorized. Please log in.");
  }
  next();
};

export default isAuthenticated;
