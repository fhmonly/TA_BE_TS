import { body, matchedData, param, query } from "express-validator"
import expressValidatorErrorHandler from "../../middleware/expressValidatorErrorHandler"
import { NextFunction, Request, Response } from "express"
import { TAPIResponse } from "../../types/core/http"
import { IProductTable, ISupplierTable } from "../../types/db-model"
import createHttpError from "http-errors"
import parsePhoneNumberFromString from "libphonenumber-js"
import { createProduct, deleteProductById, getProductByProductCode, getProducts, showProductById, updateProductById } from "../../services/productServices"

const addProduct = [
    body('product_code').notEmpty().isString(),
    body('product_name').notEmpty().isString(),
    body('stock')
        .optional({ values: 'falsy' })
        .isNumeric({ no_symbols: true }).withMessage('Contact must contain only digits (0-9), no symbols allowed'),
    body('selling_price')
        .optional({ values: 'falsy' })
        .isNumeric({ no_symbols: true }).withMessage('Contact must contain only digits (0-9), no symbols allowed'),
    body('buying_price')
        .optional({ values: 'falsy' })
        .isNumeric({ no_symbols: true }).withMessage('Contact must contain only digits (0-9), no symbols allowed'),
    body('product_category_id')
        .optional({ values: 'falsy' })
        .isNumeric({ no_symbols: true }).withMessage('Contact must contain only digits (0-9), no symbols allowed'),
    expressValidatorErrorHandler,
    async (req: Request, res: Response, next: NextFunction) => {
        const reqData = matchedData<IProductTable>(req)
        try {
            const newProductId = await createProduct({
                ...reqData,
                buying_price: reqData.buying_price || null,
                selling_price: reqData.selling_price || null,
                stock: reqData.stock || 0,
                product_category_id: reqData.product_category_id || null,
                user_id: req.user!.id
            })
            const result: TAPIResponse = {
                success: true,
                message: 'New product successfully created.',
                data: {
                    productId: newProductId
                }
            }
            res.json(result)
        } catch (error) {
            next(createHttpError(500, error as Error))
        }
    }
]

const showAllProducts = [
    query('page').optional().isInt(),
    query('limit').optional().isInt(),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { page = 1, limit = 10 } = matchedData(req)
            const products = await getProducts(req.user!.id, page, limit);
            const result: TAPIResponse = {
                success: true,
                data: products
            }
            res.json(result)
        } catch (error) {
            next(createHttpError(500, error as Error))
        }
    }
]

const getProductDetail = [
    param('id'),
    expressValidatorErrorHandler,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = matchedData(req)
            const product = await showProductById(id)
            const result: TAPIResponse = {
                success: true,
                data: product
            }
            res.json(result)
        } catch (error) {
            next(createHttpError(500, error as Error))
        }
    }
]

const updateProductRoute = [
    param('id').notEmpty(),
    body('product_code').notEmpty().isString(),
    body('product_name').notEmpty().isString(),
    body('stock')
        .optional({ values: 'falsy' })
        .isNumeric({ no_symbols: true }).withMessage('Contact must contain only digits (0-9), no symbols allowed'),
    body('selling_price')
        .optional({ values: 'falsy' })
        .isNumeric({ no_symbols: true }).withMessage('Contact must contain only digits (0-9), no symbols allowed'),
    body('buying_price')
        .optional({ values: 'falsy' })
        .isNumeric({ no_symbols: true }).withMessage('Contact must contain only digits (0-9), no symbols allowed'),
    body('product_category_id')
        .optional({ values: 'falsy' })
        .isNumeric({ no_symbols: true }).withMessage('Contact must contain only digits (0-9), no symbols allowed'),
    expressValidatorErrorHandler,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = matchedData(req, { locations: ['params'] })
            const reqBody = matchedData<IProductTable>(req, { locations: ['body'] })
            await updateProductById(id, {
                ...reqBody,
                buying_price: reqBody.buying_price || null,
                selling_price: reqBody.selling_price || null,
                stock: reqBody.stock || 0,
                product_category_id: reqBody.product_category_id || null,
            })
            const result: TAPIResponse = {
                success: true,
                message: 'Product data successfully updated'
            }
            res.json(result)
        } catch (error) {
            next(createHttpError(500, error as Error))
        }
    }
]

const deleteProductRoute = [
    param('id'),
    expressValidatorErrorHandler,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = matchedData(req)
            await deleteProductById(id)
            const result: TAPIResponse = {
                success: true,
                message: 'Product successfully deleted'
            }
            res.json(result)
        } catch (error) {
            next(createHttpError(500, error as Error))
        }
    }
]

const getProductByProductCodeRoute = [
    param('product_code'),
    expressValidatorErrorHandler,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { product_code } = matchedData(req)
            const product = await getProductByProductCode(
                req.user!.id,
                product_code,
            )

            if (!product) {
                return next(createHttpError(404, 'Produk tidak ditemukan'))
            }

            const result: TAPIResponse = {
                success: true,
                data: product
            }
            res.json(result)
        } catch (error) {
            next(createHttpError(500, error as Error))
        }
    }
]

export default { addProduct, showAllProducts, getProductDetail, updateProductRoute, deleteProductRoute, getProductByProductCodeRoute }