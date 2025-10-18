import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import { config } from "./config/app.config";
import session from "express-session";
import "./config/passport.config";
import passport from "passport";
import cors from "cors";
import { ErrorCodeEnum } from "./enums/error-code.enum";
import { HTTPSTATUS } from "./config/http.config";
import { BadRequestException } from "./utils/appErrors";
import { asyncHandler } from "./middlewares/async.Middleware";
import connectDatabase from "./config/db.Config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import authRoutes from "./routes/auth.route";
import workspaceRoutes from "./routes/workspace.route";
import isAuthenticated from "./middlewares/isAuthenticated.middleware";
import memberRoutes from "./routes/member.route";




const app = express();

const BASE_PATH = config.BASE_PATH


app.use(express.json());

app.use(express.urlencoded({ extended: true }))

app.use(
  session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      secure: config.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
    },
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

app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/workspace`, isAuthenticated, workspaceRoutes);
app.use(`${BASE_PATH}/member`, isAuthenticated, memberRoutes);

app.use(errorHandler);


app.listen(config.PORT, async () => {
  console.log(`Server listening on port ${config.PORT} in ${config.NODE_ENV}`);
  await connectDatabase();
});

