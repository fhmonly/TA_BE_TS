import { body, matchedData, param } from "express-validator";
import expressValidatorErrorHandler from "../../middleware/expressValidatorErrorHandler";
import { NextFunction, Request, Response } from "express";
import { IProductCategoryTable } from "../../types/db-model";
import { createProductCategory, deleteProductCategory, showAllProductCategory, updateProductCategoryById } from "../../services/productCategoryServices";
import createHttpError from "http-errors";
import { TAPIResponse } from "../../types/core/http";

const addProductCategory = [
    body("category_name").notEmpty().isString(),
    expressValidatorErrorHandler,
    async (req: Request, res: Response, next: NextFunction) => {
        const reqBody = matchedData<IProductCategoryTable>(req)
        try {
            const newProductId = await createProductCategory({
                ...reqBody,
                category_name: reqBody.category_name.toLowerCase(),
                user_id: req.user!.id
            })
            const result: TAPIResponse = {
                success: true,
                message: 'New product category successfully created.',
                data: {
                    productCategoryId: newProductId
                }
            }
            res.json(result)
        } catch (error: unknown) {
            next(createHttpError(500, error as Error))
        }

    }
]

const getProductCategories = [
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const productCategories = await showAllProductCategory(req.user!.id)
            const result: TAPIResponse = {
                success: true,
                data: productCategories
            }
            res.json(result)
        } catch (error) {
            next(createHttpError(500, error as Error))
        }
    }
]

const deleteProductCategoryRoute = [
    param('id'),
    expressValidatorErrorHandler,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = matchedData(req)
            await deleteProductCategory(id, req.user!.id)
            const result: TAPIResponse = {
                success: true,
                message: 'Product category successfully deleted'
            }
            res.json(result)
        } catch (error) {
            next(createHttpError(500, error as Error))
        }
    }
]

const updateProductCategory = [
    param("id").notEmpty(),
    body("category_name").notEmpty(),
    expressValidatorErrorHandler,
    async (req: Request, res: Response, next: NextFunction) => {
        const reqParam = matchedData(req, { locations: ['params'] })
        const reqBody = matchedData<IProductCategoryTable>(req, { locations: ['body'] })
        try {
            const newProductId = await updateProductCategoryById(reqParam.id, {
                ...reqBody,
                category_name: reqBody.category_name.toLowerCase()
            })
            const result: TAPIResponse = {
                success: true,
                message: 'Product category successfully updated.',
                data: {
                    productCategoryId: newProductId
                }
            }
            res.json(result)
        } catch (error: unknown) {
            next(createHttpError(500, error as Error))
        }

    }
]


export default {
    addProductCategory, getProductCategories, deleteProductCategoryRoute
}