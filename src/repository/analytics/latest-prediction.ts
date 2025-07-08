import { db } from "../../database/MySQL"
import { IPredictionTable } from "../../types/db-model"

export function selectLatestPredictions(
    user_id: IPredictionTable['user_id'],
    periodType: IPredictionTable['period_type'],
    predictionSource: IPredictionTable['prediction_source']
) {
    return db('predictions as p')
        .join('products as pr', 'p.product_id', 'pr.id')
        .join('product_categories as pc', 'pr.product_category_id', 'pc.id')
        .select(
            'pr.product_name',
            'pr.stock',
            'p.mape',
            'p.prediction',
            'pc.category_name',
        )
        .where({
            'p.prediction_source': predictionSource,
            'p.period_type': periodType,
            'p.user_id': user_id
        })
        .andWhere('p.expired', '>', db.fn.now())
        .orderBy('p.expired', 'desc')
        .limit(4);
}