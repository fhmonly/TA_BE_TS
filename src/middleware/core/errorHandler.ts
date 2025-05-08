import { ErrorRequestHandler } from "express";
import { TAPIResponse } from "../../types/core/http";
import dotenv from 'dotenv'
dotenv.config()

export const respondWithError: ErrorRequestHandler = (err, req, res, _next) => {
    res.status(err.status || 500);

    if (
        req.xhr ||
        req.headers["content-type"] === "application/json" ||
        req.headers.accept?.includes("application/json")
    ) {
        const errorResponse: TAPIResponse<any[]> = { success: false }

        if ([
            'Access token required',
            'Invalid or expired access token',
            'No refresh token provided',
            'Invalid refresh token'
        ].includes(err.message)) {
            errorResponse.message = err.message
        } else if (err.message === 'Validation Error') {
            errorResponse.message = err.message
            errorResponse.error = err.cause
        } else {
            errorResponse.message = err.message || "Internal Server Error"
            errorResponse.error = err
        }

        res.json(errorResponse);
        return
    }

    res.locals.message = `${err.message}`;
    res.locals.error = process.env.NODE_ENV === 'development' ? err : {};
    res.render('error');
}