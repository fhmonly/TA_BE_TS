import express, { NextFunction, Request, Response } from "express";
import { body, param, matchedData } from "express-validator";
import createHttpError from "http-errors";
import { purchases, products, suppliers } from "../../database/models";
import validate from "../../middleware/expressValidatorErrorHandler";

// 🟢 **POST: Tambah Pembelian Stok Baru**
const createStockPurchase = [
    body("amount").notEmpty().isNumeric().withMessage("Amount must be a number"),
    body("total_price").notEmpty().isNumeric().withMessage("Total price must be a number"),
    body("user_id").notEmpty().isMongoId().withMessage("Invalid user ID"),
    body("product_id").notEmpty().isMongoId().withMessage("Invalid product ID"),
    body("supplier_id").notEmpty().isMongoId().withMessage("Invalid supplier ID"),
    validate,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = matchedData(req);

            // Cek apakah produk ada
            const productExists = await products.findById(data.product_id);
            if (!productExists) return next(createHttpError(404, "Product not found"));

            // Cek apakah supplier ada
            const supplierExists = await suppliers.findById(data.supplier_id);
            if (!supplierExists) return next(createHttpError(404, "Supplier not found"));

            // Simpan data pembelian
            const purchase = new purchases(data);
            await purchase.save();
            res.status(201).json({ message: "Stock purchase created", purchase });
        } catch (err) {
            next(createHttpError(500, "Internal Server Error", { cause: err }));
        }
    }
];

// 🟠 **PATCH: Perbarui Pembelian Stok**
const updateStockPurchase = [
    param("id").isMongoId().withMessage("Invalid purchase ID"),
    body("amount").optional().isNumeric().withMessage("Amount must be a number"),
    body("total_price").optional().isNumeric().withMessage("Total price must be a number"),
    body("supplier_id").optional().isMongoId().withMessage("Invalid supplier ID"),
    validate,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const data = matchedData(req);

            if (data.supplier_id) {
                const supplierExists = await suppliers.findById(data.supplier_id);
                if (!supplierExists) return next(createHttpError(404, "Supplier not found"));
            }

            const purchase = await purchases.findByIdAndUpdate(id, data, { new: true });
            if (!purchase) return next(createHttpError(404, "Stock purchase not found"));

            res.json({ message: "Stock purchase updated", purchase });
        } catch (err) {
            next(createHttpError(500, "Internal Server Error", { cause: err }));
        }
    }
];

// 🔴 **DELETE: Hapus Pembelian Stok**
const deleteStockPurchase = [
    param("id").isMongoId().withMessage("Invalid purchase ID"),
    validate,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const purchase = await purchases.findByIdAndDelete(id);
            if (!purchase) return next(createHttpError(404, "Stock purchase not found"));

            res.json({ message: "Stock purchase deleted" });
        } catch (err) {
            next(createHttpError(500, "Internal Server Error", { cause: err }));
        }
    }
];

// 🔵 **GET: Ambil Satu Pembelian Stok Berdasarkan ID**
const getStockPurchase = [
    param("id").isMongoId().withMessage("Invalid purchase ID"),
    validate,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const purchase = await purchases.findById(id).populate("product_id supplier_id user_id");

            if (!purchase) return next(createHttpError(404, "Stock purchase not found"));

            res.json(purchase);
        } catch (err) {
            next(createHttpError(500, "Internal Server Error", { cause: err }));
        }
    }
];

// 🟡 **GET: Ambil Semua Pembelian Stok (Histori)**
const getStockPurchases = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allPurchases = await purchases.find().populate("product_id supplier_id user_id");
        res.json(allPurchases);
    } catch (err) {
        next(createHttpError(500, "Internal Server Error", { cause: err }));
    }
};

export default {
    createStockPurchase,
    updateStockPurchase,
    deleteStockPurchase,
    getStockPurchase,
    getStockPurchases
};
