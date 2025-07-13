import { insertPrediction, selectPrediction, updatePrediction } from "../../repository/predictionRepository"
import { IPredictionTable } from "../../types/db-model"
import { TPythonAutoPredictionResponse, TPythonManualPredictionResponse } from "../../types/request/python-api"
import { getExpiredDateFromMonth, getExpiredDateFromWeek } from "../../utils/core/date"

export async function persistPrediction(
    prediction_result: TPythonAutoPredictionResponse | TPythonManualPredictionResponse,
    prediction_period: IPredictionTable['period_type'],
    source: IPredictionTable['prediction_source'],
    product_id: IPredictionTable['product_id'],
    user_id: IPredictionTable['user_id']
) {
    const previous = await selectPrediction(product_id, prediction_period, source)
    const expired = prediction_period === 'monthly' ?
        getExpiredDateFromMonth(new Date(), 1) :
        getExpiredDateFromWeek(new Date(), 1)

    const record = {
        ...previous,
        lower_bound: JSON.stringify(prediction_result.lower.map(v => Math.round(v), 0)),
        prediction: JSON.stringify(prediction_result.prediction.map(v => Math.round(v))),
        upper_bound: JSON.stringify(prediction_result.upper.map(v => Math.round(v))),
        period_type: prediction_period,
        prediction_source: source,
        product_id,
        user_id,
        mape: Math.round((prediction_result as TPythonAutoPredictionResponse)?.mape || previous?.mape || 0),
        rmse: Math.round((prediction_result as TPythonAutoPredictionResponse)?.rmse || previous?.rmse || 0),
        expired
    }

    console.log(record)

    if (!!previous?.id) {
        await updatePrediction(previous.id, record)
    } else {
        const id = await insertPrediction(record)
        record.id = id
    }

    return record
}
