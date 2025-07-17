import { ErrorRequestHandler } from 'express';
import { TAPIResponse } from '../../types/core/http';
import dotenv from 'dotenv';
dotenv.config();

export const respondWithErrorNoView: ErrorRequestHandler = (err, req, res, _next) => {
    res.status(err.status || 500);

    const isJsonRequest =
        req.xhr ||
        req.headers['content-type'] === 'application/json' ||
        req.headers.accept?.includes('application/json');

    // Paksa semua jadi JSON response (tidak lagi render)
    const errorResponse: TAPIResponse<any[]> = {
        success: false,
        message: '',
    };

    if (
        [
            'Access token required',
            'Invalid or expired access token',
            'No refresh token provided',
            'Invalid refresh token',
        ].includes(err.message)
    ) {
        errorResponse.message = err.message;
    } else if (err.message === 'Validation Error') {
        errorResponse.message = err.message;
        errorResponse.error = err.cause;
    } else {
        errorResponse.message = err.message || 'Internal Server Error';

        if (process.env.NODE_ENV === 'development') {
            errorResponse.error = err;
        }
    }

    res.json(errorResponse);
};
