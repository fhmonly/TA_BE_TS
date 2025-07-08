import createHttpError, { HttpError } from "http-errors";
import { isErrorInstanceOfHttpError } from "../core/httpError";
import dotenv from 'dotenv'
dotenv.config()

export function sendResponseError(error: unknown): HttpError {
    let newError: HttpError;
    if (isErrorInstanceOfHttpError(error)) {
        newError = error;
    } else {
        newError = createHttpError(500, "Internal Server Error", { cause: error });
    }

    if (process.env.NODE_ENV === 'development') {
        console.error(newError);
    }

    return newError;
}