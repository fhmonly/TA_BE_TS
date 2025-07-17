// src/app.ts
import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import path from 'path';

import apiRouter from './routes/api';
import connectDB from './database/MySQL';
import { respondWithErrorNoView } from './middleware/core/errorHandlerNoView';
import { getLocalIP } from './dev-core';

const app = express();
const localIP = getLocalIP();

// 🌐 Allowed Origins
const allowedOrigins = [
    process.env.HOST,
    'https://stokin.vercel.app',
    'http://localhost:3000',
    `http://${localIP}:3000`,
];

const corsOptions: cors.CorsOptions = {
    origin(origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
};

// ✅ Middleware stack
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // OPTIONS preflight
app.use((req, _res, next) => {
    console.log(`[${req.method}] ${req.originalUrl}`);
    next();
});
app.use(compression());
app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 🔌 DB Connection
connectDB();

// ✅ Health Check Route
app.get('/', (req, res) => {
    res.json({
        status: 'running',
        developer: 'Fahim',
        project: 'Stock Prediction with ARIMA',
    });
});

// 🔗 API Routes
app.use('/api', apiRouter);

// ❌ Tangani CORS error eksplisit
app.use(((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err.message === 'Not allowed by CORS') {
        console.error('❌ CORS error:', req.headers.origin);
        return res.status(403).json({ error: 'CORS policy does not allow this origin.' });
    }
    next(err);
}) as express.ErrorRequestHandler);

// 🛑 Global Error Handler (JSON only)
app.use(respondWithErrorNoView);

// ✅ Run Dev Server (skip di serverless)
const PORT = parseInt(process.env.PORT || '5000', 10);
app.listen(PORT, () => {
    try {
        console.log(`Running on ${PORT}`);
    } catch (error) {
        throw error;
    }
})