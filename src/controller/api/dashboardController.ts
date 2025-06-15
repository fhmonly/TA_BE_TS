import { NextFunction, Request, Response } from "express";
import { getDashboardData } from "../../services/dashboardServices";
import { TAPIResponse } from "../../types/core/http";
import createHttpError from "http-errors";
import { matchedData, param } from "express-validator";
import { selectThisYearSalesTrendMonthly, selectThisYearSalesTrendWeekly } from "../../repository/analytics/sale-trend";
import { selectThisYearRestockTrendMonthly, selectThisYearRestockTrendWeekly } from "../../repository/analytics/purchase-trend";
import { selectLatestPredictions } from "../../repository/analytics/latest-prediction";

const dashboardDataController = [
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const totalProduct = await getDashboardData(req.user!.id)
            const result: TAPIResponse = {
                success: true,
                data: totalProduct
            }
            res.json(result)
        } catch (error) {
            console.log(error)
            next(createHttpError(500, "Internal Server Error", { cause: error }));
        }
    }
]

const dashboardTrendController = [
    param('period_type')
        .isIn(['weekly', 'monthly'])
        .withMessage('period_type must be either "weekly" or "monthly"'),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { period_type } = matchedData(req)

            const sales = await (
                period_type === 'weekly' ?
                    selectThisYearSalesTrendWeekly(req.user!.id) :
                    selectThisYearSalesTrendMonthly(req.user!.id)
            )

            const purchase = await (
                period_type === 'weekly' ?
                    selectThisYearRestockTrendWeekly(req.user!.id) :
                    selectThisYearRestockTrendMonthly(req.user!.id)
            )

            const result: TAPIResponse = {
                success: true,
                data: {
                    sales,
                    purchase
                }
            }
            res.json(result)
        } catch (error) {
            console.log(error)
            next(createHttpError(500, "Internal Server Error", { cause: error }));
        }
    }
]

const dashboardLatestPredictionController = [
    param('period_type')
        .isIn(['weekly', 'monthly'])
        .withMessage('period_type must be either "weekly" or "monthly"'),
    param('trx_type')
        .isIn(["sales", "purchases"])
        .withMessage('period_type must be either "sales" or "purchases"'),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {
                period_type,
                trx_type
            } = matchedData(req)
            const latest = await selectLatestPredictions(
                req.user!.id, period_type, trx_type
            )
            const result: TAPIResponse = {
                success: true,
                data: latest
            }
            res.json(result)
        } catch (error) {
            console.log(error)
            next(createHttpError(500, "Internal Server Error", { cause: error }));
        }
    }
]

export default {
    dashboardDataController,
    dashboardTrendController,
    dashboardLatestPredictionController
}