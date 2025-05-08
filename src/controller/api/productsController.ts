// controllers/productsController.ts

import express, { NextFunction, Request, Response } from "express";
import { body, param } from "express-validator";
import createHttpError from "http-errors";
import { matchedData } from "express-validator";
import * as productCategoriesRepository from "../../repository/productCategories"; // Repository untuk Product Categories
import * as productsRepository from "../../repository/products"; // Repository untuk Products
import validate from "../../middleware/expressValidatorErrorHandler"; // Validation middleware

// POST: Tambah produk baru
const createProduct = [
    body("product_name").notEmpty().withMessage("Product name is required"),
    body("description").optional().isString(),
    body("price").notEmpty().isNumeric().withMessage("Price must be a number"),
    body("product_category_id").notEmpty().isInt().withMessage("Invalid category ID"), // Ganti isMongoId() ke isInt()
    validate,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = matchedData(req);

            // Cek apakah kategori produk ada di database
            const categoryExists = await productCategoriesRepository.getProductCategoryById(data.product_category_id);
            if (!categoryExists) return next(createHttpError(404, "Category not found"));

            // Simpan produk
            const product = await productsRepository.createProduct(data);

            res.status(201).json({ message: "Product created", product });
        } catch (err) {
            next(createHttpError(500, "Internal Server Error", { cause: err }));
        }
    }
];

// PATCH: Perbarui produk
const updateProduct = [
    param("id").isInt().withMessage("Invalid product ID"), // Ganti isMongoId() ke isInt()
    body("product_name").optional().isString(),
    body("description").optional().isString(),
    body("price").optional().isNumeric().withMessage("Price must be a number"),
    body("product_category_id").optional().isInt().withMessage("Invalid category ID"), // Ganti isMongoId() ke isInt()
    validate,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const data = matchedData(req);

            // Jika ada perubahan kategori, cek apakah kategori tersebut ada
            if (data.product_category_id) {
                const categoryExists = await productCategoriesRepository.getProductCategoryById(data.product_category_id);
                if (!categoryExists) return next(createHttpError(404, "Category not found"));
            }

            // Update produk
            const product = await productsRepository.updateProductById(Number(id), data);
            if (!product) return next(createHttpError(404, "Product not found"));

            res.json({ message: "Product updated", product });
        } catch (err) {
            next(createHttpError(500, "Internal Server Error", { cause: err }));
        }
    }
];

// DELETE: Hapus produk
const deleteProduct = [
    param("id").isInt().withMessage("Invalid product ID"), // Ganti isMongoId() ke isInt()
    validate,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;

            const product = await productsRepository.deleteProductById(Number(id));
            if (!product) return next(createHttpError(404, "Product not found"));

            res.json({ message: "Product deleted" });
        } catch (err) {
            next(createHttpError(500, "Internal Server Error", { cause: err }));
        }
    }
];

// GET: Ambil satu produk berdasarkan ID
const getProduct = [
    param("id").isInt().withMessage("Invalid product ID"), // Ganti isMongoId() ke isInt()
    validate,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const product = await productsRepository.getProductById(Number(id));

            if (!product) return next(createHttpError(404, "Product not found"));

            // Ambil kategori produk terkait (join dengan kategori produk)
            const productCategory = await productCategoriesRepository.getProductCategoryById(product.product_category_id);
            product.product_category = productCategory; // Menambahkan informasi kategori ke dalam produk

            res.json(product);
        } catch (err) {
            next(createHttpError(500, "Internal Server Error", { cause: err }));
        }
    }
];

// GET: Ambil semua produk
const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allProducts = await productsRepository.getAllProducts();

        // Ambil kategori produk terkait untuk setiap produk
        for (const product of allProducts) {
            const category = await productCategoriesRepository.getProductCategoryById(product.product_category_id);
            product.product_category = category;
        }

        res.json(allProducts);
    } catch (err) {
        next(createHttpError(500, "Internal Server Error", { cause: err }));
    }
};

export default {
    createProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    getProducts
};
