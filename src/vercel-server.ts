// src/app.ts
import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';

import apiRouter from './routes/api';
import connectDB from './database/MySQL';
import { root_path } from './utils/core/storage';
import { respondWithError } from './middleware/core/errorHandler';
import { getLocalIP } from './dev-core';

const app = express();

const localIP = getLocalIP()

// 🚨 1. Setup Allowed Origins
const allowedOrigins = [
    process.env.HOST,
    'https://stokin.vercel.app',
    'http://localhost:3000',
    `http://${localIP}:3000`,
];

const corsOptions: cors.CorsOptions = {
    origin(origin, callback) {
        if (!origin) return callback(null, true); // Allow server-to-server or curl
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
};

// 🚨 2. Pasang CORS Middleware DULUAN
app.use(cors(corsOptions));
// 💡 3. Handle all OPTIONS preflight
app.options('*', cors(corsOptions));

// 🔍 4. Logging semua request (termasuk OPTIONS)
app.use((req, _res, next) => {
    console.log(`[${req.method}] ${req.originalUrl}`);
    next();
});

// 💨 Middleware lain
app.use(compression());
app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 🖼️ View engine
app.set('views', root_path('src/views'));
app.set('view engine', 'ejs');

// 🔌 DB connection
connectDB();

// ✅ Basic endpoint untuk cek server hidup
app.get('/', function (req, res) {
    res.json({
        status: 'running',
        developer: 'Fahim',
        project: 'Stock Prediction with ARIMA',
    });
});

// 🔗 API Router
app.use('/api', apiRouter);

// 🚨 5. Tangani CORS error secara eksplisit
app.use(((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err.message === 'Not allowed by CORS') {
        console.error('❌ CORS error:', req.headers.origin);
        return res.status(403).json({ error: 'CORS policy does not allow this origin.' });
    }
    next(err);
}) as express.ErrorRequestHandler);

// ❗ 6. Global error handler (dari kamu)
const PORT = parseInt(process.env.PORT || "5000", 10);

app.use(respondWithError);
app.listen(PORT, () => {
    try {
        console.log(`Running on ${PORT}`);
    } catch (error) {
        throw error;
    }
})