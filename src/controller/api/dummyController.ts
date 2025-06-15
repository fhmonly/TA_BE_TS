import { body, matchedData, param } from "express-validator"
import expressValidatorErrorHandler from "../../middleware/expressValidatorErrorHandler"
import { NextFunction, Request, Response } from "express"
import { insertDummy, selectAllDummyFromProduct, updateDummy } from "../../repository/dummyRepository"
import { TAPIResponse } from "../../types/core/http"
import createHttpError from "http-errors"
import { IDummiesTable } from "../../types/db-model"

const getSalesDummy = [
    param('period_type')
        .isIn(['weekly', 'monthly'])
        .withMessage('period_type must be either "weekly" or "monthly"'),
    expressValidatorErrorHandler,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { period_type } = matchedData<{ period_type: 'weekly' | 'monthly' }>(req)
            const dummySales = await selectAllDummyFromProduct(req.user!.id, period_type, 'sales')
            const result: TAPIResponse = {
                success: true,
                data: dummySales
            }
            res.json(result)
        } catch (error) {
            console.log(error)
            next(createHttpError(500, "Internal Server Error", { error }));
        }
    }
]
const getPurchasesDummy = [
    param('period_type')
        .isIn(['weekly', 'monthly'])
        .withMessage('period_type must be either "weekly" or "monthly"'),
    expressValidatorErrorHandler,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { period_type } = matchedData<{ period_type: 'weekly' | 'monthly' }>(req)
            const dummyPurchase = await selectAllDummyFromProduct(req.user!.id, period_type, 'purchases')
            const result: TAPIResponse = {
                success: true,
                data: dummyPurchase
            }
            res.json(result)
        } catch (error) {
            console.log(error)
            next(createHttpError(500, "Internal Server Error", { error }));
        }
    }
]

const createDummy = [
    body('product_id')
        .isInt().withMessage('product_id must be an integer'),

    body('fake_json')
        .custom((val) => {
            try {
                const parsed = JSON.parse(val);
                if (!Array.isArray(parsed)) {
                    throw new Error('fake_json must be a JSON array');
                }
                // Optional: Validasi bahwa semua item adalah number
                if (!parsed.every((item) => typeof item === 'number')) {
                    throw new Error('All items in fake_json must be numbers');
                }
                return true;
            } catch (e) {
                throw new Error('fake_json must be a valid JSON array');
            }
        }),

    body('period_type')
        .isIn(['weekly', 'monthly'])
        .withMessage('period_type must be either "weekly" or "monthly"'),

    body('trx_type')
        .isIn(['sales', 'purchases'])
        .withMessage('trx_type must be either "sales" or "purchases"'),
    expressValidatorErrorHandler,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const reqData = matchedData<IDummiesTable>(req)
            const dummy_id = await insertDummy(reqData)
            const result: TAPIResponse = {
                success: true,
                data: { dummy_id }
            }
            res.json(result)
        } catch (error) {
            console.log(error)
            next(createHttpError(500, "Internal Server Error", { error }));
        }
    }
]
const updateDummyController = [
    param('id'),

    body('fake_json')
        .custom((val) => {
            try {
                const parsed = JSON.parse(val);
                if (!Array.isArray(parsed)) {
                    throw new Error('fake_json must be a JSON array');
                }
                // Optional: Validasi bahwa semua item adalah number
                if (!parsed.every((item) => typeof item === 'number')) {
                    throw new Error('All items in fake_json must be numbers');
                }
                return true;
            } catch (e) {
                throw new Error('fake_json must be a valid JSON array');
            }
        }),
    expressValidatorErrorHandler,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = matchedData<IDummiesTable>(req, { locations: ['params'] })
            const reqData = matchedData<IDummiesTable>(req, { locations: ['body'] })
            await updateDummy(id, reqData)
            const result: TAPIResponse = {
                success: true,
                message: 'Dummy data successfully updated',
            }
            res.json(result)
        } catch (error) {
            console.log(error)
            next(createHttpError(500, "Internal Server Error", { error }));
        }
    }
]
export default {
    getPurchasesDummy, getSalesDummy, createDummy, updateDummyController
}