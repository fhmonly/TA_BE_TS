import { db } from "../database/MySQL";
import { IPredictionModelTable, IPredictionTable, IProductTable, ITransactionTable } from "../types/db-model";
import { TGroupedProductSales } from "../types/db/product-sales";
import { selectProductsByUserId } from "./productsRepository";

export async function selectWeeklyProductSales(
    product_id: ITransactionTable['product_id']
) {
    return db.raw<TGroupedProductSales[]>(`
        SELECT 
            DATE_SUB(DATE(t.transaction_date), INTERVAL WEEKDAY(t.transaction_date) DAY) AS group_date,
            COUNT(*) AS total_transactions
        FROM transactions t
        WHERE t.product_id = ?
        GROUP BY group_date
        ORDER BY group_date ASC
    `, [product_id]);
}

export async function selectMonthlyProductSales(
    product_id: ITransactionTable['product_id']
) {
    return db.raw<TGroupedProductSales[]>(`
        SELECT 
            DATE_FORMAT(t.created_at, '%Y-%m') AS group_date,
            p.product_name,
            p.product_code,
            t.product_id,
            COUNT(*) AS total_transactions
        FROM transactions t
        LEFT JOIN products p ON t.product_id = p.id
        WHERE t.product_id = ?
        GROUP BY group_date, p.product_name, p.product_code, t.product_id
        ORDER BY group_date
    `, [product_id])
}

export async function selectAllProductNPrediction(
    user_id: IProductTable['user_id'],
    period_type: IPredictionTable['period_type'],
    prediction_source: IPredictionTable['prediction_source']
) {
    return db('products')
        .leftJoin('predictions', function () {
            this.on('predictions.product_id', '=', 'products.id')
                .andOn(db.raw('predictions.period_type = ?', [period_type]))
                .andOn(db.raw('predictions.prediction_source = ?', [prediction_source]))
                .andOn(db.raw('predictions.expired >= ?', [new Date().toISOString()]));
        })
        // .leftJoin('dummies', function () {
        //     this.on('dummies.product_id', '=', 'products.id')
        //         .andOn(db.raw('dummies.period_type = ?', [period_type]))
        //         .andOn(db.raw('dummies.trx_type = ?', [prediction_source]))
        // })
        .where('products.user_id', user_id)
        .andWhere('products.deleted', false)
        .select(
            'products.id',
            'products.product_name',
            'products.buying_price',
            'products.stock',
            'products.low_stock_limit',
            'predictions.prediction',
            'predictions.lower_bound',
            'predictions.upper_bound',
            'predictions.rmse',
            'predictions.mape',
            // 'dummies.fake_json',
        )
}

export function selectPrediction(
    product_id: IPredictionTable['product_id'],
    period_type: IPredictionTable['period_type'],
    prediction_source: IPredictionTable['prediction_source']
) {
    return db<IPredictionTable>('predictions')
        .where({ product_id, period_type, prediction_source })
        .first()
}

export async function insertPrediction(data: Partial<IPredictionTable>) {
    const [id] = await db<IPredictionTable>('predictions').insert(data)
    return id
}

export function updatePrediction(id: IPredictionTable['id'], data: Partial<IPredictionTable>) {
    return db<IPredictionTable>('predictions').where({ id }).update(data)
}

export function selectDetailPrediction(
    product_id: IPredictionTable['product_id'],
    period_type: IPredictionTable['period_type'],
    prediction_source: IPredictionTable['prediction_source'],
) {
    return db<IProductTable>('products')
        .leftJoin('predictions', function () {
            this.on('predictions.product_id', '=', 'products.id')
                .andOn(db.raw('predictions.period_type = ?', [period_type]))
                .andOn(db.raw('predictions.prediction_source = ?', [prediction_source]))
                .andOn(db.raw('predictions.expired >= ?', [new Date().toISOString()]));
        })
        .where('products.id', product_id)
        .select(
            'products.product_code',
            'products.product_name',
            'products.stock',
            'products.selling_price',
            'products.buying_price',
            'predictions.prediction',
            'predictions.lower_bound',
            'predictions.upper_bound',
            'predictions.mape',
            'predictions.rmse'
        ).first();
}