import { body, matchedData, query } from "express-validator";
import expressValidatorErrorHandler from "../../middleware/expressValidatorErrorHandler";
import { NextFunction, Request, Response } from "express";
import { TAPIResponse } from "../../types/core/http";
import { addRestocksRecords, showRestockHistory } from "../../services/restockServices";
import createHttpError from "http-errors";
import { addTransactionRecords, showSalesHistory } from "../../services/transactionServices";

const createRestockRecord = [
    body('data').isArray().withMessage('Body must be array'),
    body('data.*.product_code')
        .isString().withMessage('product_code must be string')
        .notEmpty().withMessage('product_code is required'),
    body('data.*.product_name')
        .isString().withMessage('product_name must be string')
        .notEmpty().withMessage('product_name is required'),
    body('data.*.price')
        .isNumeric().withMessage('price must be number'),
    body('data.*.amount')
        .isNumeric().withMessage('amount must be number'),
    expressValidatorErrorHandler,
    async (req: Request, res: Response, next: NextFunction) => {
        const { data }: {
            data: {
                product_code: string;
                product_name: string;
                price: number;
                amount: number;
            }[]
        } = matchedData(req, { locations: ['body'] });
        try {
            await addRestocksRecords(data, req.user!.id)
            const result: TAPIResponse = {
                success: true,
                message: 'Restock successful.',
            }
            res.json(result)
        } catch (error) {
            next(createHttpError(500, error as Error))
        }
    }
]

const createTransactionRecord = [
    body('data').isArray().withMessage('Body must be array'),
    body('data.*.product_code')
        .isString().withMessage('product_code must be string')
        .notEmpty().withMessage('product_code is required'),
    body('data.*.product_name')
        .isString().withMessage('product_name must be string')
        .notEmpty().withMessage('product_name is required'),
    body('data.*.price')
        .isNumeric().withMessage('price must be number'),
    body('data.*.amount')
        .isNumeric().withMessage('amount must be number'),
    expressValidatorErrorHandler,
    async (req: Request, res: Response, next: NextFunction) => {
        const { data }: {
            data: {
                product_code: string;
                product_name: string;
                price: number;
                amount: number;
            }[]
        } = matchedData(req, { locations: ['body'] });
        try {
            await addTransactionRecords(data, req.user!.id)
            const result: TAPIResponse = {
                success: true,
                message: 'Transaction successful.',
            }
            res.json(result)
        } catch (error) {
            next(createHttpError(500, error as Error))
        }
    }
]

const showRestockHistoryRoute = [
    query('page').optional().isInt(),
    query('limit').optional().isInt(),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { page = 1, limit = 10 } = matchedData(req)
            const restockHistory = await showRestockHistory(req.user!.id, page, limit)
            const result: TAPIResponse = {
                success: true,
                data: restockHistory
            }
            res.json(result)
        } catch (error) {
            next(createHttpError(500, error as Error))
        }
    }
]

const showSalesHistoryRoute = [
    query('page').optional().isInt(),
    query('limit').optional().isInt(),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { page = 1, limit = 10 } = matchedData(req)
            const restockHistory = await showSalesHistory(req.user!.id, page, limit)
            const result: TAPIResponse = {
                success: true,
                data: restockHistory
            }
            res.json(result)
        } catch (error) {
            next(createHttpError(500, error as Error))
        }
    }
]

export default {
    createRestockRecord,
    createTransactionRecord,
    showRestockHistoryRoute,
    showSalesHistoryRoute
}