import dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcrypt';
import jwt, { VerifyCallback } from 'jsonwebtoken';
import nodemailer from 'nodemailer';

import createHttpError from 'http-errors';
import { generateAccessToken, generateRefreshToken } from '../../utils/api/generateCredentialToken';

import { body, matchedData, param } from 'express-validator';
import expressValidatorErrorHandler from '../../middleware/expressValidatorErrorHandler';
import { NextFunction, Request, Response } from 'express';
import { createUser } from '../../repository/usersRepository';
import { activateUser, getUserByEmail, getUserByRefreshToken, updateUserById } from '../../services/userServices';
import { TAPIResponse } from '../../types/core/http';

const saltRounds = 10;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

type TAccountActivationToken = {
    email: string
}

const register = [
    body('email')
        .notEmpty().withMessage('Email is required')
        .normalizeEmail()
        .isEmail().withMessage('Invalid email format'),

    body('name')
        .optional()
        .isString().withMessage('Name must be a string')
        .isLength({ min: 4, max: 20 }).withMessage('Name must be between 4 and 20 characters'),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isStrongPassword({ minLength: 8 }).withMessage('Password must be strong (min 8 chars, uppercase, lowercase, number, and symbol)'),

    body('emailActivationPage')
        .optional().isString(),

    expressValidatorErrorHandler,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, name, password, emailActivationPage = process.env.HOST } = matchedData(req);

            // Cek apakah user sudah terdaftar
            const existingUser = await getUserByEmail(email);
            if (existingUser) return next(createHttpError(400, "Email already exists"));

            // Hash password
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Buat token verifikasi
            const activationToken = jwt.sign({ email } as TAccountActivationToken, process.env.JWT_SECRET, { expiresIn: '1h' });

            // Simpan user
            const newUser = await createUser({ email, name: name ?? email, password: hashedPassword });

            // Kirim email verifikasi
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Verify Your Email",
                text: `Click this link to verify your email: ${emailActivationPage}/${activationToken}`
            };

            transporter.sendMail(mailOptions, (err) => {
                if (err) return next(createHttpError(500, "Error sending verification email", { cause: err }));
            });

            const resultResponse: TAPIResponse = {
                success: true,
                message: "User registered. Please check your email to verify your account. Please check your email inbox or spam inbox."
            }
            if (process.env.NODE_ENV === 'development') {
                console.log(mailOptions)
            }
            res.status(201).json(resultResponse);
        } catch (err) {
            next(createHttpError(500, "Error registering user", { cause: err }));
        }
    }
];

const verify = [
    param('token').isString().withMessage('Token must be string'),
    expressValidatorErrorHandler,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { token } = matchedData(req);
            const decoded = jwt.verify(token, process.env.JWT_SECRET) as TAccountActivationToken;

            // Update status verifikasi
            const user = await getUserByEmail(decoded.email)

            if (!user) return next(createHttpError(400, "Invalid Token"));

            await activateUser(decoded.email)
            const resultResponse: TAPIResponse = {
                success: true,
                message: "Email verified successfully. You can now log in."
            }
            res.json(resultResponse);
        } catch (err: any) {
            next(createHttpError(400, "Invalid or expired token", { cause: err }));
        }
    }
];

const resendEmailVerification = [
    param('token').isString().withMessage('Token must be string'),
    body('emailActivationPage')
        .optional().isString(),
    expressValidatorErrorHandler,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { token, emailActivationPage } = matchedData(req);
            const decoded = jwt.decode(token) as TAccountActivationToken
            const user = await getUserByEmail(decoded.email)
            if (!user) return next(createHttpError(400, "Invalid Token"));
            if (user.is_verified) return next(createHttpError(409, "This account has already been verified. You can log in directly."));

            const activationToken = jwt.sign({ email: decoded.email } as TAccountActivationToken, process.env.JWT_SECRET, { expiresIn: '1h' });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: decoded.email,
                subject: "Verify Your Email",
                text: `Click this link to verify your email: ${emailActivationPage}/${activationToken}`
            };

            transporter.sendMail(mailOptions, (err) => {
                if (err) return next(createHttpError(500, "Error sending verification email", { cause: err }));
            });

            const resultResponse: TAPIResponse = {
                success: true,
                message: "Verification email has been sent successfully. Please check your email inbox or spam inbox."
            }
            if (process.env.NODE_ENV === 'development') {
                console.log(mailOptions)
            }
            res.json(resultResponse)
        } catch (err) {
            next(createHttpError(400, "Invalid or expired token", { cause: err }));
        }
    }
];

const login = [
    body('email')
        .notEmpty().withMessage('Email is required')
        .normalizeEmail()
        .isEmail().withMessage('Invalid email format'),

    body('password')
        .notEmpty().withMessage('Password is required'),

    expressValidatorErrorHandler,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = matchedData(req);

            // Cari user
            const user = await getUserByEmail(email);
            if (!user) return next(createHttpError(400, "Invalid credentials"));

            // Cek apakah email sudah diverifikasi
            if (!user.is_verified) return next(createHttpError(400, "Please verify your email first"));

            // Bandingkan password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return next(createHttpError(400, "Invalid credentials"))
            };

            // Buat tokens
            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);

            // Simpan refresh token di database
            await updateUserById(user.id, {
                refresh_token: refreshToken
            })
            const isProd = process.env.NODE_ENV === 'production';
            // Kirim token sebagai cookie
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: isProd,
                sameSite: isProd ? 'none' : 'lax',
                maxAge: 30 * 24 * 60 * 60 * 1000
            });

            const resultResponse: TAPIResponse = {
                success: true,
                message: `Welcome back, ${user.name}`,
                data: { accessToken }
            }
            res.json(resultResponse);
        } catch (err) {
            next(createHttpError(500, "Error logging in", { cause: err }));
        }
    }
];

const refreshToken = [
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) return next(createHttpError(401, "No refresh token provided"));

            // Cari user dengan refresh token
            const user = await getUserByRefreshToken(refreshToken);
            if (!user) return next(createHttpError(403, "Invalid refresh token"));

            const jwtVerifCB: VerifyCallback = (err, decoded) => {
                if (err) return next(createHttpError(403, "Invalid refresh token"));

                // Buat access token baru
                const accessToken = generateAccessToken(user);


                const resultResponse: TAPIResponse = {
                    success: true,
                    data: { accessToken }
                }

                res.json(resultResponse);
            }

            // Verifikasi refresh token
            jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, jwtVerifCB);
        } catch (err) {
            next(createHttpError(500, "Error refreshing token", { cause: err }));
        }
    }
];

const logout = [
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                res.sendStatus(204);
                return
            }  // Tidak ada token, langsung selesai

            // Hapus refresh token dari database
            await updateUserById(req.user!.id, {
                refresh_token: null
            })

            res.clearCookie("refreshToken", { httpOnly: true, secure: process.env.NODE_ENV === "production" });

            const resultResponse: TAPIResponse = {
                success: true,
                message: "Logged out successfully"
            }
            res.json(resultResponse);
        } catch (err) {
            next(createHttpError(500, "Error logging out", { cause: err }));
        }
    }
];

const forgotPasswordSendEmail = [
    body('email')
        .notEmpty().withMessage('Email is required')
        .normalizeEmail()
        .isEmail().withMessage('Invalid email format'),

    body('emailActivationPage')
        .optional().isString(),

    expressValidatorErrorHandler,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, emailActivationPage } = matchedData(req);

            // Cari user
            const user = await getUserByEmail(email);
            if (user) {
                if (!user.is_verified) return next(createHttpError(403, "Please verify your email first"));

                const forgotPasswordToken = jwt.sign({ email } as TAccountActivationToken, process.env.JWT_SECRET, { expiresIn: '1h' });

                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: email,
                    subject: "Forgot Password Link",
                    text: `Click this link to change your password: ${emailActivationPage}/${forgotPasswordToken}`
                };

                transporter.sendMail(mailOptions, (err) => {
                    if (err) return next(createHttpError(500, "Error sending forgot password link email", { cause: err }));
                });

                const resultResponse: TAPIResponse = {
                    success: true,
                    message: "Forgot password link has been sent successfully. Please check your email inbox or spam inbox."
                }
                if (process.env.NODE_ENV === 'development') {
                    console.log(mailOptions)
                }
                res.json(resultResponse);
            } else {
                return next(createHttpError(400, "Invalid credentials"))
            }

        } catch (err) {
            next(createHttpError(500, "Failed to generate forgot password token.", { cause: err }));
        }
    }
];

const forgotPasswordVerifyToken = [
    param('token').isString().withMessage('Token must be string'),
    expressValidatorErrorHandler,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { token } = matchedData(req);
            const decoded = jwt.verify(token, process.env.JWT_SECRET) as TAccountActivationToken;

            // Update status verifikasi
            const user = await getUserByEmail(decoded.email)

            if (!user) return next(createHttpError(400, "Invalid Token"));

            await activateUser(decoded.email)
            const resultResponse: TAPIResponse = {
                success: true,
                message: "Token is Valid."
            }
            res.json(resultResponse);
        } catch (err: any) {
            next(createHttpError(400, "Invalid or expired token", { cause: err }));
        }
    }
];

const forgotPasswordChangePassword = [
    param('token').isString().withMessage('Token must be string'),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isStrongPassword({ minLength: 8 }).withMessage('Password must be strong (min 8 chars, uppercase, lowercase, number, and symbol)'),

    expressValidatorErrorHandler,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { token, password } = matchedData(req);

            // Cari user
            const decoded = jwt.verify(token, process.env.JWT_SECRET) as TAccountActivationToken;
            const user = await getUserByEmail(decoded.email);
            if (!user) return next(createHttpError(400, "User not found."));

            // Cek apakah email sudah diverifikasi
            if (!user.is_verified) return next(createHttpError(400, "Please verify your email first"));

            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Simpan refresh token di database
            await updateUserById(user.id, {
                password: hashedPassword
            })

            const resultResponse: TAPIResponse = {
                success: true,
                message: `Password changed successful.`
            }
            res.json(resultResponse);
        } catch (err) {
            next(createHttpError(500, "Error logging in", { cause: err }));
        }
    }
];

export default {
    register,
    verify, resendEmailVerification,
    login,
    forgotPasswordSendEmail, forgotPasswordVerifyToken, forgotPasswordChangePassword,
    refreshToken,
    logout,
};
