import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import createHttpError from 'http-errors';

const expressValidatorErrorHandler: RequestHandler = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(createHttpError(400, "Validation Error", { cause: errors.array() }));
    }
    next();
};

export default expressValidatorErrorHandler