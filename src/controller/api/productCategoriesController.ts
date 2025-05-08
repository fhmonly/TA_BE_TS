import express, { NextFunction, Request, Response } from 'express';
import { body, matchedData, param } from 'express-validator';
import createHttpError from 'http-errors';
import { product_categories } from '../../database/models';
import expressValidatorErrorHandler from '../../middleware/expressValidatorErrorHandler';

const router = express.Router();

// POST: Tambah kategori baru
const createCategory = [
    body("category_name").notEmpty().withMessage("Category name is required"),
    body("description").optional().isString(),
    body("user_id").notEmpty().withMessage("User ID is required").isMongoId(),
    expressValidatorErrorHandler,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = matchedData(req);
            const category = new product_categories(data);
            await category.save();
            res.status(201).json({ message: "Category created", category });
        } catch (err) {
            next(createHttpError(500, "Internal Server Error", { cause: err }));
        }
    }
];

// PATCH: Perbarui kategori
const updateCategory = [
    param("id").isMongoId().withMessage("Invalid category ID"),
    body("category_name").optional().isString(),
    body("description").optional().isString(),
    expressValidatorErrorHandler,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const data = matchedData(req);
            const category = await product_categories.findByIdAndUpdate(id, data, { new: true });
            if (!category) return next(createHttpError(404, "Category not found"));
            res.json({ message: "Category updated", category });
        } catch (err) {
            next(createHttpError(500, "Internal Server Error", { cause: err }));
        }
    }
]

// DELETE: Hapus kategori
const deleteCategory = [
    param("id").isMongoId().withMessage("Invalid category ID"),
    expressValidatorErrorHandler,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const category = await product_categories.findByIdAndDelete(id);
            if (!category) return next(createHttpError(404, "Category not found"));
            res.json({ message: "Category deleted" });
        } catch (err) {
            next(createHttpError(500, "Internal Server Error", { cause: err }));
        }
    }
]

// GET: Ambil satu kategori berdasarkan ID
const getCategory = [
    param("id").isMongoId().withMessage("Invalid category ID"),
    expressValidatorErrorHandler,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const category = await product_categories.findById(id);
            if (!category) return next(createHttpError(404, "Category not found"));
            res.json(category);
        } catch (err) {
            next(createHttpError(500, "Internal Server Error", { cause: err }));
        }
    }
]

// GET: Ambil semua kategori
const getCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categories = await product_categories.find();
        res.json(categories);
    } catch (err) {
        next(createHttpError(500, "Internal Server Error", { cause: err }));
    }
}

export default {
    createCategory,
    updateCategory,
    deleteCategory,
    getCategory,
    getCategories,
};
