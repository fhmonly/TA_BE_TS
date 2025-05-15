import { body, matchedData, param, query } from "express-validator"
import expressValidatorErrorHandler from "../../middleware/expressValidatorErrorHandler"
import { NextFunction, Request, Response } from "express"
import { createSupplier, deleteSupplier, getSupplier, getSuppliers, updateSupplier } from "../../services/supplierServices"
import { TAPIResponse } from "../../types/core/http"
import { ISupplierTable } from "../../types/db-model"
import createHttpError from "http-errors"
import parsePhoneNumberFromString from "libphonenumber-js"

const addSupplier = [
    body('supplier_name').notEmpty().isString(),
    body('contact')
        .optional({ nullable: true })
        .isNumeric({ no_symbols: true }).withMessage('Contact must contain only digits (0-9), no symbols allowed'),
    body('address').optional().isString(),
    expressValidatorErrorHandler,
    async (req: Request, res: Response, next: NextFunction) => {
        const reqData = matchedData<ISupplierTable>(req)
        const phone = parsePhoneNumberFromString(`+${reqData.contact}`);
        if (!phone?.isValid())
            next(createHttpError(400, 'Invalid phone number format. Please match international format.'))
        try {
            const newSupplierId = await createSupplier({
                ...reqData,
                user_id: req.user!.id
            })
            const result: TAPIResponse = {
                success: true,
                message: 'New supplier successfully created.',
                data: {
                    supplierId: newSupplierId
                }
            }
            res.json(result)
        } catch (error) {
            next(createHttpError(500, error as Error))
        }
    }
]

const showAllSupplier = [
    query('page').optional().isInt(),
    query('limit').optional().isInt(),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { page = 1, limit = 10 } = matchedData(req)
            const suppliers = await getSuppliers(req.user!.id, page, limit);
            const result: TAPIResponse = {
                success: true,
                data: suppliers
            }
            res.json(result)
        } catch (error) {
            next(createHttpError(500, error as Error))
        }
    }
]

const getSupplierDetail = [
    param('id'),
    expressValidatorErrorHandler,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = matchedData(req)
            const supplier = await getSupplier(id)
            const result: TAPIResponse = {
                success: true,
                data: supplier
            }
            res.json(result)
        } catch (error) {
            next(createHttpError(500, error as Error))
        }
    }
]

const updateSupplierRoute = [
    param('id'),
    body('supplier_name').notEmpty().isString(),
    body('contact')
        .optional({ nullable: true })
        .isNumeric({ no_symbols: true }).withMessage('Contact must contain only digits (0-9), no symbols allowed'),
    body('address').optional().isString(),
    expressValidatorErrorHandler,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = matchedData(req, { locations: ['params'] })
            const reqBody = matchedData<ISupplierTable>(req, { locations: ['body'] })
            const phone = parsePhoneNumberFromString(`+${reqBody.contact}`);
            if (!phone?.isValid())
                next(createHttpError(400, 'Invalid phone number format. Please match international format.'))
            await updateSupplier(id, reqBody)
            const result: TAPIResponse = {
                success: true,
                message: 'Supplier data successfully updated'
            }
            res.json(result)
        } catch (error) {
            next(createHttpError(500, error as Error))
        }
    }
]

const deleteSupplierRoute = [
    param('id'),
    expressValidatorErrorHandler,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = matchedData(req)
            await deleteSupplier(id)
            const result: TAPIResponse = {
                success: true,
                message: 'Supplier successfully deleted'
            }
            res.json(result)
        } catch (error) {
            next(createHttpError(500, error as Error))
        }
    }
]
export default { addSupplier, showAllSupplier, getSupplierDetail, updateSupplierRoute, deleteSupplierRoute }