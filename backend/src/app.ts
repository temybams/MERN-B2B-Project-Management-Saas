import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import { config } from "./config/app.config";
import session from "cookie-session";
import passport from "passport";
import cors from "cors";
import { ErrorCodeEnum } from "./enums/error-code.enum";
import { HTTPSTATUS } from "./config/http.config";
import { BadRequestException } from "./utils/appErrors";
import { asyncHandler } from "./middlewares/async.Middleware";
import connectDatabase from "./config/db.Config";



const app = express();


app.use(express.json());

app.use(express.urlencoded({ extended: true }))

app.use(
  session({
    name: "session",
    keys: [config.SESSION_SECRET],
    maxAge: 24 * 60 * 60 * 1000,
    secure: config.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: config.FRONTEND_ORIGIN,
    credentials: true,
  })
);



app.get(
  `/`,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    throw new BadRequestException(
      "This is a bad request",
      ErrorCodeEnum.AUTH_INVALID_TOKEN
    );
    return res.status(HTTPSTATUS.OK).json({
      message: "Hello, this is my project management project",
    });
  })
);



app.listen(config.PORT, async () => {
  console.log(`Server listening on port ${config.PORT} in ${config.NODE_ENV}`);
  await connectDatabase();
});

