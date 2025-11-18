import passport from "passport";
import { Types } from "mongoose";
import { Request } from "express";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";

import { config } from "./app.config";
import { NotFoundException } from "../utils/appErrors";
import { ProviderEnum } from "../enums/account-provider.enum";
import {
  loginOrCreateAccountService,
  verifyUserService,
} from "../services/auth.service";

import  User from "../models/user.model";

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: config.GOOGLE_CALLBACK_URL,
      scope: ["profile", "email"],
      passReqToCallback: true,
    },
    async (req: Request, accessToken, refreshToken, profile, done) => {
      try {
        const { email, sub: googleId, picture } = profile._json;
        console.log(profile, "profile");
        console.log(googleId, "googleId");
        if (!googleId) {
          throw new NotFoundException("Google ID (sub) is missing");
        }

        const { user } = await loginOrCreateAccountService({
          provider: ProviderEnum.GOOGLE,
          displayName: profile.displayName,
          providerId: googleId,
          picture: picture,
          email: email,
        });
        done(null, { ...user, _id: user._id.toString() } as any);

      } catch (error) {
        done(error, false);
      }
    }
  )
);

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      session: true,
    },
    async (email, password, done) => {
      try {
        const user = await verifyUserService({ email, password });
        return done(null, { ...user, _id: user._id.toString() } as any);
      } catch (error: any) {
        return done(error, false, { message: error?.message });
      }
    }
  )
);

// Only store user._id in session
passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

// Retrieve full user in deserialize
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id).select("-password");
    if (!user) return done(new NotFoundException("User not found"), null);


    done(null, user); 
  } catch (error) {
    done(error, null);
  }
});

