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

// import internalRouter from './routes/internal';
import apiRouter from './routes/api';
import connectDB from './database/MySQL';
import { root_path } from './utils/core/storage';
import { respondWithError } from './middleware/core/errorHandler';
// import schedule from 'node-schedule';

const app = express();

// Middleware
const allowedOrigins = ['http://localhost:3000', 'https://myapp.com'];

app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(compression());
app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup
// app.set('views', path.join(__dirname, 'views'));
app.set('views', root_path('src/views'));
app.set('view engine', 'ejs');

// Database connection
connectDB();

app.get('/', function (req, res, next) {
  res.json({
    status: 'running',
    developer: 'Fahim',
    project: 'Stock Prediction with ARIMA'
  });
});

app.use('/api', apiRouter);

// 404 handler (opsional, bisa diaktifkan jika perlu)
// app.use((_req, _res, next) => {
//   next(createHttpError(404));
// });

// Scheduler (opsional, jika ingin dijalankan otomatis)
// const scheduleMidnight = schedule.scheduleJob('0 0 * * *', async () => {
//   const result = await runningSchedule() ? 'success running midnight schedule' : 'failed running midnight schedule';
//   console.log(result);
// });

// const scheduleNoon = schedule.scheduleJob('0 12 * * *', async () => {
//   const result = await runningSchedule() ? 'success running noon schedule' : 'failed running noon schedule';
//   console.log(result);
// });

app.use(respondWithError);

export default app;
