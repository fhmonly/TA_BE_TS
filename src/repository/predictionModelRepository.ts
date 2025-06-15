import { db } from "../database/MySQL";
import { IPredictionModelTable } from "../types/db-model";

export function selectPredictionModel(
    product_id: IPredictionModelTable['product_id'],
    period_type: IPredictionModelTable['period_type'],
    prediction_source: IPredictionModelTable['prediction_source']
) {
    return db<IPredictionModelTable>('prediction_models')
        .where({ product_id, period_type, prediction_source })
        .first()
}

export async function insertPredictionModel(
    data: Partial<IPredictionModelTable>
) {
    const [id] = await db<IPredictionModelTable>('prediction_models').insert(data)
    return id
}

export async function updatePredictionModel(
    id: IPredictionModelTable['id'],
    data: Partial<IPredictionModelTable>
) {
    return await db<IPredictionModelTable>('prediction_models').where({ id }).update(data)
}