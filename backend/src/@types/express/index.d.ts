import { RequestUser } from "../request";

declare global {
  namespace Express {
    interface User extends RequestUser {}
  }
}

export {};