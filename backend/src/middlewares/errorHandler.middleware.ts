import { ErrorRequestHandler, Response } from "express";
import { HTTPSTATUS } from "../config/http.config";
import { AppError } from "../utils/appErrors";
import { z, ZodError } from "zod";
import { ErrorCodeEnum } from "../enums/error-code.enum";
import { error } from "console";




//validation error from zod
const formatZodError = (res: Response, error: z.ZodError) => {
    const errors = error?.issues?.map((err) => ({
        field: err.path.join("."),
        message: err.message,
    }));

    return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: "Validation failed",
        errors: errors,
        errorCode: ErrorCodeEnum.VALIDATION_ERROR,

    });
}

// Global error handler middleware
export const errorHandler: ErrorRequestHandler = (
    error,
    req,
    res,
    next
): any => {
    console.error(`Error Occured on PATH: ${req.path} `, error);

    if (error instanceof SyntaxError) {
        return res.status(HTTPSTATUS.BAD_REQUEST).json({
            message: "Invalid JSON format. please check your request body.",
        });
    }

    if (error instanceof ZodError) {
        return formatZodError(res, error);
    }

    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            message: error.message,
            errorCode: error.errorCode,
        });
    }

    res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
        errorCode: ErrorCodeEnum.INTERNAL_SERVER_ERROR,
    });

};