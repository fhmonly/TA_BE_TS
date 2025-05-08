// repository/productsRepository.ts

import { db } from "../database/MySQL"; // Koneksi database menggunakan Knex
import { IProduct } from "../types/db-model";

const TABLE_NAME = "products";

// Tambah produk baru
export const createProduct = async (data: IProduct) => {
    try {
        const [product] = await db(TABLE_NAME).insert({
            product_name: data.product_name,
            price: data.price,
            product_category_id: data.product_category_id,
        }).returning("*");

        return product;
    } catch (err) {
        throw new Error("Error creating product");
    }
};

// Update produk by ID
export const updateProductById = async (id: number, data: Partial<IProduct>) => {
    try {
        const [updatedProduct] = await db(TABLE_NAME)
            .where({ id })
            .update(data)
            .returning("*");

        return updatedProduct;
    } catch (err) {
        throw new Error("Error updating product");
    }
};

// Hapus produk by ID
export const deleteProductById = async (id: number) => {
    try {
        const deleted = await db(TABLE_NAME).where({ id }).del();
        return deleted;
    } catch (err) {
        throw new Error("Error deleting product");
    }
};

// Ambil produk by ID
export const getProductById = async (id: number) => {
    try {
        const product = await db(TABLE_NAME).where({ id }).first();
        return product;
    } catch (err) {
        throw new Error("Error fetching product");
    }
};

// Ambil semua produk
export const getAllProducts = async () => {
    try {
        return await db(TABLE_NAME);
    } catch (err) {
        throw new Error("Error fetching all products");
    }
};
