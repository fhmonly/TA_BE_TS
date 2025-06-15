import createHttpError from "http-errors"
import { makePrivateManualPrediction } from "../predictionServices"
import { IPredictionTable } from "../../types/db-model"

export async function buildManualPrediction(
    csv_string: string,
    prediction_period: IPredictionTable['period_type'],
    model: [number, number, number]
) {
    const result = await makePrivateManualPrediction({
        csv_string,
        prediction_period,
        value_column: 'amount',
        arima_model: model
    })

    if (!result) throw createHttpError(422, 'Prediksi gagal: model tidak mengembalikan hasil.')

    if (
        result.prediction[0] < 1
    )
        throw createHttpError(422, 'Hasil prediksi tidak valid: nilai prediksi terlalu kecil atau negatif. Jika menggunakan data dummy, pastikan data tersebut tidak fluktuatif dan masih relevan dengan data asli. Jika tidak menggunakan data dummy, kemungkinan produk ini tidak dapat diprediksi secara akurat.');

    return result
}
