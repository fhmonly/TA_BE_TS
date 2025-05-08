import { RequestHandler } from "express";
import createHttpError from "http-errors";
import jwt from 'jsonwebtoken';
import { TAccessToken } from "../types/jwt";

const authenticate: RequestHandler = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(createHttpError(401, "Access token required"));
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return next(createHttpError(403, "Invalid or expired access token"));

        req.user = decoded as TAccessToken;
        next();
    });
};

export default authenticate;
