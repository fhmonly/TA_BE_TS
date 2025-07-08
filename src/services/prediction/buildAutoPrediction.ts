import createHttpError from "http-errors"
import { makePrivateAutoPrediction } from "../predictionServices"
import { IPredictionTable } from "../../types/db-model"

export async function buildAutoPrediction(
    csv_string: string,
    prediction_period: IPredictionTable['period_type'],
    future_step: number = 1
) {
    const result = await makePrivateAutoPrediction({
        csv_string,
        prediction_period,
        value_column: 'amount',
        future_step
    })

    if (!result) throw createHttpError(422, 'Prediksi gagal: model tidak mengembalikan hasil.')

    if (result.mape > 50) {
        throw createHttpError(422, `Prediksi tidak layak karena MAPE terlalu tinggi (${result.mape.toFixed(2)}%). Harap periksa data input.`)
    }

    return result
}