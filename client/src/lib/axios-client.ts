import { CustomError } from "@/types/custom-error.type";
import axios from "axios";

// Production must use Vercel's same-origin proxy so session cookies remain
// first-party. The environment variable is only needed by local development.
const baseURL = import.meta.env.PROD
  ? "/api"
  : import.meta.env.VITE_API_BASE_URL || "/api";

const options = {
  baseURL,
  withCredentials: true,
  timeout: 10000,
};

const API = axios.create(options);

API.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { data, status } = error.response || {};

    if (data === "Unauthorized" && status === 401) {
      window.location.href = "/";
    }

    const customError: CustomError = {
      ...error,
      message:
        data?.message ||
        data?.error ||
        error.message ||
        "Something went wrong. Please try again.",
      errorCode: data?.errorCode || "UNKNOWN_ERROR",
    };

    return Promise.reject(customError);
  }
);

export default API;
