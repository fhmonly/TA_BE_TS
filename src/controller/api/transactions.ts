// controllers/transactionsController.ts

import { body, param, matchedData } from "express-validator";
import createHttpError from "http-errors";
import validate from "../../middleware/expressValidatorErrorHandler";  // Validation middleware
import * as transactionsRepository from "../../repository/transaction"; // Repository untuk Transactions dalam bentuk mongoose
import * as productsRepository from "../../repository/products"; // Untuk cek produk
import { NextFunction, Request, Response } from "express";
import { ITransaction } from "../../types/db-model";

// 🟢 **POST: Tambah Transaksi Baru**
const createTransaction = [
    body("amount").notEmpty().isNumeric().withMessage("Amount must be a number"),
    body("total_price").notEmpty().isNumeric().withMessage("Total price must be a number"),
    body("user_id").notEmpty().isInt().withMessage("Invalid user ID"),  // isMongoId() diganti isInt()
    body("product_id").notEmpty().isInt().withMessage("Invalid product ID"),  // isMongoId() diganti isInt()
    validate,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = matchedData<ITransaction>(req);

            // Cek apakah produk ada
            const productExists = await productsRepository.getProductById(data.product_id);
            if (!productExists) return next(createHttpError(404, "Product not found"));

            // Simpan data transaksi
            const transaction = await transactionsRepository.createTransaction(data);

            res.status(201).json({ message: "Transaction created", transaction });
        } catch (err) {
            next(createHttpError(500, "Internal Server Error", { cause: err }));
        }
    }
];

// 🟠 **PATCH: Perbarui Transaksi**
const updateTransaction = [
    param("id").isInt().withMessage("Invalid transaction ID"),  // isMongoId() diganti isInt()
    body("amount").optional().isNumeric().withMessage("Amount must be a number"),
    body("total_price").optional().isNumeric().withMessage("Total price must be a number"),
    validate,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const data = matchedData<ITransaction>(req);

            const transaction = await transactionsRepository.updateTransactionById(Number(id), data);
            if (!transaction) return next(createHttpError(404, "Transaction not found"));

            res.json({ message: "Transaction updated", transaction });
        } catch (err) {
            next(createHttpError(500, "Internal Server Error", { cause: err }));
        }
    }
];

// 🔴 **DELETE: Hapus Transaksi**
const deleteTransaction = [
    param("id").isInt().withMessage("Invalid transaction ID"),  // isMongoId() diganti isInt()
    validate,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const transaction = await transactionsRepository.deleteTransactionById(Number(id));
            if (!transaction) return next(createHttpError(404, "Transaction not found"));

            res.json({ message: "Transaction deleted" });
        } catch (err) {
            next(createHttpError(500, "Internal Server Error", { cause: err }));
        }
    }
];

// 🔵 **GET: Ambil Satu Transaksi Berdasarkan ID**
const getTransaction = [
    param("id").isInt().withMessage("Invalid transaction ID"),  // isMongoId() diganti isInt()
    validate,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const transaction = await transactionsRepository.getTransactionById(Number(id));

            if (!transaction) return next(createHttpError(404, "Transaction not found"));

            res.json(transaction);
        } catch (err) {
            next(createHttpError(500, "Internal Server Error", { cause: err }));
        }
    }
];

// 🟡 **GET: Ambil Semua Transaksi**
const getTransactions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allTransactions = await transactionsRepository.getAllTransactions();
        res.json(allTransactions);
    } catch (err) {
        next(createHttpError(500, "Internal Server Error", { cause: err }));
    }
};

export default {
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getTransaction,
    getTransactions
};
