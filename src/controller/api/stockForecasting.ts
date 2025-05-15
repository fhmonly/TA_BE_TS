import express, { NextFunction, Request, Response } from "express";
import { body, param, query, matchedData } from "express-validator";
import createHttpError from "http-errors";
import validate from "../../middleware/expressValidatorErrorHandler";
import { fileValidate, multiFileValidate } from "../../middleware/fileUploader";
import axios from "axios";

// 🟢 **POST: Tambah Prediksi Stok Baru**
// const createStockForecasting = [
//     body("stock_sold").notEmpty().isNumeric().withMessage("Stock sold must be a number"),
//     body("stock_predicted").notEmpty().isNumeric().withMessage("Stock predicted must be a number"),
//     body("type").notEmpty().isString().withMessage("Type is required"),
//     body("accuracy").optional().isNumeric().withMessage("Accuracy must be a number"),
//     body("user_id").notEmpty().isMongoId().withMessage("Invalid user ID"),
//     body("product_id").notEmpty().isMongoId().withMessage("Invalid product ID"),
//     validate,
//     async (req: Request, res: Response, next: NextFunction) => {
//         try {
//             const data = matchedData(req);

//             // Cek apakah produk ada
//             const productExists = await products.findById(data.product_id);
//             if (!productExists) return next(createHttpError(404, "Product not found"));

//             // Simpan data prediksi
//             const prediction = new predictions(data);
//             await prediction.save();
//             res.status(201).json({ message: "Stock forecasting created", prediction });
//         } catch (err) {
//             next(createHttpError(500, "Internal Server Error", { cause: err }));
//         }
//     }
// ];

// // 🔵 **GET: Ambil Prediksi Berdasarkan Tanggal**
// const getStockForecastingByDate = [
//     query("date").notEmpty().isISO8601().withMessage("Invalid date format"),
//     validate,
//     async (req: Request, res: Response, next: NextFunction) => {
//         try {
//             const { date } = matchedData(req);
//             const startDate = new Date(date);
//             const endDate = new Date(date);
//             endDate.setDate(endDate.getDate() + 1);

//             const forecasts = await predictions.find({
//                 createdAt: { $gte: startDate, $lt: endDate }
//             }).populate("product_id user_id");

//             if (forecasts.length === 0) return next(createHttpError(404, "No stock forecasting found for this date"));

//             res.json(forecasts);
//         } catch (err) {
//             next(createHttpError(500, "Internal Server Error", { cause: err }));
//         }
//     }
// ];

// // 🟠 **GET: Ambil Semua Prediksi (History)**
// const getStockForecastings = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const forecasts = await predictions.find().populate("product_id user_id");
//         res.json(forecasts);
//     } catch (err) {
//         next(createHttpError(500, "Internal Server Error", { cause: err }));
//     }
// };

const makePredictionFromSheet = [
    fileValidate('sheet'),
    async (req: Request, res: Response, next: NextFunction) => {
        res.json({
            status: true,
            message: 'File Saved'
        })
    }
]

export default {
    // createStockForecasting,
    // getStockForecastingByDate,
    // getStockForecastings
    makePredictionFromSheet
};
