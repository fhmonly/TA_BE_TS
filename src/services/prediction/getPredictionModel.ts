import { selectPredictionModel } from "../../repository/predictionModelRepository"
import { IPredictionTable } from "../../types/db-model"

export async function getPredictionModel(
    product_id: number,
    prediction_period: IPredictionTable['period_type'],
    source: IPredictionTable['prediction_source']
) {
    const model = await selectPredictionModel(product_id, prediction_period, source)
    const isExpired = !model?.expired || new Date(model.expired) < new Date()

    return { model, isExpired }
}
