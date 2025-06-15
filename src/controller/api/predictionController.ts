import { NextFunction, Request, Response } from "express";
import { TAPIResponse } from "../../types/core/http";
import createHttpError from "http-errors";
import { selectAllProductNPrediction } from "../../repository/predictionRepository";
import { body, matchedData, param } from "express-validator";
import { makeAutoPrediction } from "../../services/predictionServices";
import expressValidatorErrorHandler from "../../middleware/expressValidatorErrorHandler";
import { IPredictionTable } from "../../types/db-model";
import { preparePredictionData } from "../../services/prediction/prepareData";
import { getPredictionModel } from "../../services/prediction/getPredictionModel";
import { shouldUseAutoModel } from "../../services/prediction/shouldUseAutoModel";
import { buildAutoPrediction } from "../../services/prediction/buildAutoPrediction";
import { savePredictionModel } from "../../services/prediction/savePredictionModel";
import { buildManualPrediction } from "../../services/prediction/buildManualPrediction";
import { persistPrediction } from "../../services/prediction/persistPrediction";
import { isErrorInstanceOfHttpError } from "../../utils/core/httpError";

const periodArray = ['daily', 'weekly', 'monthly']

const filePrediction = [
    body('csv_string')
        .notEmpty().withMessage('csv_string tidak boleh kosong.')
        .isString().withMessage('csv_string harus berupa string.'),

    body('record_period')
        .notEmpty().withMessage('record_period tidak boleh kosong.')
        .isIn(['daily', 'weekly', 'monthly']).withMessage('record_period harus bernilai "weekly" atau "monthly".'),

    body('prediction_period')
        .notEmpty().withMessage('prediction_period tidak boleh kosong.')
        .isIn(['weekly', 'monthly']).withMessage('prediction_period harus bernilai "weekly" atau "monthly".'),

    body('value_column')
        .optional()
        .isString().withMessage('value_column harus berupa string.'),

    body('date_column')
        .optional()
        .isString().withMessage('date_column harus berupa string.'),
    expressValidatorErrorHandler,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {
                csv_string,
                record_period,
                prediction_period,
                value_column,
                date_column
            } = matchedData(req)
            const rp_index = periodArray.findIndex(v => v === record_period)
            const pp_index = periodArray.findIndex(v => v === prediction_period)
            if (pp_index < 0 || rp_index < 0) {
                next(createHttpError(400, 'record_period atau prediction_period tidak valid.'));
                return;
            }

            if (pp_index < rp_index) {
                next(createHttpError(400, 'prediction_period tidak boleh memiliki resolusi lebih kecil dari record_period.'));
                return;
            }

            const pythonResponse = await makeAutoPrediction({
                csv_string,
                date_column,
                value_column,
                prediction_period,
                date_regroup: record_period !== prediction_period,
            })

            if (!pythonResponse?.mape || pythonResponse.mape > 50) {
                throw createHttpError(422, `Prediksi tidak layak karena MAPE terlalu tinggi (${pythonResponse?.mape.toFixed(2) || NaN}%). Harap periksa data input.`)
            }

            if (pythonResponse) {
                const result: TAPIResponse = {
                    success: true,
                    message: 'Prediksi berhasil dilakukan.',
                    data: pythonResponse,
                };
                res.json(result);
                return
            }

            res.status(500).json({
                success: false,
                message: 'Gagal melakukan prediksi. Silakan coba lagi atau cek data input.',
            });
        } catch (error) {
            next(createHttpError(500, "Internal Server Error", { cause: error }));
        }
    }
]

const getSavedPurchasePredictions = [
    param('period_type')
        .isIn(['weekly', 'monthly'])
        .withMessage('period_type must be either "weekly" or "monthly"'),
    expressValidatorErrorHandler,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { period_type } = matchedData<{ period_type: 'weekly' | 'monthly' }>(req)
            const productNPrediction = await selectAllProductNPrediction(req.user!.id, period_type, 'purchases')
            const result: TAPIResponse = {
                success: true,
                data: productNPrediction
            }
            res.json(result)
        } catch (error) {
            console.log(error)
            next(createHttpError(500, "Internal Server Error", { error }));
        }
    }
]

const getSavedSalePredictions = [
    param('period_type')
        .isIn(['weekly', 'monthly'])
        .withMessage('period_type must be either "weekly" or "monthly"'),
    expressValidatorErrorHandler,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { period_type } = matchedData<{ period_type: 'weekly' | 'monthly' }>(req)
            const productNPrediction = await selectAllProductNPrediction(req.user!.id, period_type, 'sales')
            const result: TAPIResponse = {
                success: true,
                data: productNPrediction
            }
            res.json(result)
        } catch (error) {
            console.log(error)
            next(createHttpError(500, "Internal Server Error", { error }));
        }
    }
]

const purchasePrediction = [
    param('product_id').exists().withMessage('product_id harus disediakan.')
        .isInt({ gt: 0 }).withMessage('product_id harus berupa angka bulat positif.')
        .toInt(),

    body('prediction_period')
        .notEmpty().withMessage('prediction_period tidak boleh kosong.')
        .isIn(['weekly', 'monthly']).withMessage('prediction_period harus bernilai "weekly" atau "monthly".'),

    expressValidatorErrorHandler,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const source: IPredictionTable['prediction_source'] = 'purchases'
            const { product_id, prediction_period } = matchedData(req)
            const csv_string = await preparePredictionData(product_id, prediction_period, source)
            const { model, isExpired } = await getPredictionModel(product_id, prediction_period, source)

            let predictionResult
            if (shouldUseAutoModel(model, isExpired)) {
                predictionResult = await buildAutoPrediction(csv_string, prediction_period)
                await savePredictionModel(model, predictionResult, product_id, prediction_period, source, req.user!.id)
            } else {
                const arimaModel: [number, number, number] = [model!.ar_p, model!.differencing_d, model!.ma_q]
                predictionResult = await buildManualPrediction(csv_string, prediction_period, arimaModel)
            }

            const finalResult = await persistPrediction(predictionResult, prediction_period, source, product_id, req.user!.id)

            res.status(200).json({ success: true, data: finalResult })
        } catch (err) {
            if (isErrorInstanceOfHttpError(err))
                return next(err)
            return next(createHttpError(500, 'Internal Server Error', { cause: err }))
        }
    }
]

const salesPrediction = [
    param('product_id').exists().withMessage('product_id harus disediakan.')
        .isInt({ gt: 0 }).withMessage('product_id harus berupa angka bulat positif.')
        .toInt(),

    body('prediction_period')
        .notEmpty().withMessage('prediction_period tidak boleh kosong.')
        .isIn(['weekly', 'monthly']).withMessage('prediction_period harus bernilai "weekly" atau "monthly".'),

    expressValidatorErrorHandler,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const source: IPredictionTable['prediction_source'] = 'sales'
            const { product_id, prediction_period } = matchedData(req)
            const csv_string = await preparePredictionData(product_id, prediction_period, source)
            const { model, isExpired } = await getPredictionModel(product_id, prediction_period, source)

            let predictionResult
            if (shouldUseAutoModel(model, isExpired)) {
                predictionResult = await buildAutoPrediction(csv_string, prediction_period)
                await savePredictionModel(model, predictionResult, product_id, prediction_period, source, req.user!.id)
            } else {
                const arimaModel: [number, number, number] = [model!.ar_p, model!.differencing_d, model!.ma_q]
                predictionResult = await buildManualPrediction(csv_string, prediction_period, arimaModel)
            }

            const finalResult = await persistPrediction(predictionResult, prediction_period, source, product_id, req.user!.id)

            res.status(200).json({ success: true, data: finalResult })
        } catch (err) {
            if (isErrorInstanceOfHttpError(err))
                return next(err)
            return next(createHttpError(500, 'Internal Server Error', { cause: err }))
        }
    }
]

export default {
    filePrediction,
    getSavedPurchasePredictions,
    getSavedSalePredictions,
    salesPrediction,
    purchasePrediction
}
