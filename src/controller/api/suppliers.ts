import express, { NextFunction, Request, Response } from "express";
import { body, param, matchedData } from "express-validator";
import createHttpError from "http-errors";
import { suppliers } from "../../database/models";
import validate from "../../middleware/expressValidatorErrorHandler";

// 🟢 **POST: Tambah Supplier Baru**
const createSupplier = [
    body("supplier_name").notEmpty().withMessage("Supplier name is required"),
    body("contact").optional().isString().withMessage("Contact must be a string"),
    body("address").optional().isString().withMessage("Address must be a string"),
    body("user_id").notEmpty().isMongoId().withMessage("Invalid user ID"),
    validate,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = matchedData(req);

            const supplier = new suppliers(data);
            await supplier.save();

            res.status(201).json({ message: "Supplier created", supplier });
        } catch (err) {
            next(createHttpError(500, "Internal Server Error", { cause: err }));
        }
    }
];

// 🟠 **PATCH: Perbarui Supplier**
const updateSupplier = [
    param("id").isMongoId().withMessage("Invalid supplier ID"),
    body("supplier_name").optional().isString(),
    body("contact").optional().isString(),
    body("address").optional().isString(),
    validate,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const data = matchedData(req);

            const supplier = await suppliers.findByIdAndUpdate(id, data, { new: true });
            if (!supplier) return next(createHttpError(404, "Supplier not found"));

            res.json({ message: "Supplier updated", supplier });
        } catch (err) {
            next(createHttpError(500, "Internal Server Error", { cause: err }));
        }
    }
];

// 🔴 **DELETE: Hapus Supplier**
const deleteSupplier = [
    param("id").isMongoId().withMessage("Invalid supplier ID"),
    validate,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const supplier = await suppliers.findByIdAndDelete(id);
            if (!supplier) return next(createHttpError(404, "Supplier not found"));

            res.json({ message: "Supplier deleted" });
        } catch (err) {
            next(createHttpError(500, "Internal Server Error", { cause: err }));
        }
    }
];

// 🔵 **GET: Ambil Satu Supplier Berdasarkan ID**
const getSupplier = [
    param("id").isMongoId().withMessage("Invalid supplier ID"),
    validate,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const supplier = await suppliers.findById(id).populate("user_id");

            if (!supplier) return next(createHttpError(404, "Supplier not found"));

            res.json(supplier);
        } catch (err) {
            next(createHttpError(500, "Internal Server Error", { cause: err }));
        }
    }
];

// 🟡 **GET: Ambil Semua Supplier**
const getSuppliers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allSuppliers = await suppliers.find().populate("user_id");
        res.json(allSuppliers);
    } catch (err) {
        next(createHttpError(500, "Internal Server Error", { cause: err }));
    }
};

export default {
    createSupplier,
    updateSupplier,
    deleteSupplier,
    getSupplier,
    getSuppliers
};
