import { insertPredictionModel, updatePredictionModel } from "../../repository/predictionModelRepository"
import { IPredictionModelTable, IPredictionTable } from "../../types/db-model"
import { TPythonAutoPredictionResponse, TPythonManualPredictionResponse } from "../../types/request/python-api"
import { getExpiredDateFromMonth, getExpiredDateFromWeek } from "../../utils/core/date"

export async function savePredictionModel(
    model: IPredictionModelTable | undefined,
    prediction_result: TPythonAutoPredictionResponse | TPythonManualPredictionResponse,
    product_id: IPredictionTable['product_id'],
    prediction_period: IPredictionTable['period_type'],
    source: IPredictionTable['prediction_source'],
    user_id: IPredictionTable['user_id'],
    expiration_interval: number
) {
    const [ar_p, differencing_d, ma_q] = prediction_result.arima_order
    const expired = prediction_period === 'monthly' ?
        getExpiredDateFromMonth(new Date(), expiration_interval) :
        getExpiredDateFromWeek(new Date(), expiration_interval)

    if (!model?.id) {
        await insertPredictionModel({
            ar_p,
            differencing_d,
            ma_q,
            expired,
            period_type: prediction_period,
            prediction_source: source,
            product_id,
            user_id,
        })
    } else {
        await updatePredictionModel(model.id, {
            ar_p,
            differencing_d,
            ma_q,
            expired,
            period_type: prediction_period,
            prediction_source: source,
            product_id,
            user_id,
        })
    }
}