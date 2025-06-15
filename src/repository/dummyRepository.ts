import { db } from "../database/MySQL";
import { IDummiesTable, IProductTable } from "../types/db-model";

export function selectAllDummyFromProduct(
    user_id: IProductTable['user_id'],
    period_type: IDummiesTable['period_type'],
    trx_type: IDummiesTable['trx_type']
) {
    return db('products')
        .leftJoin('dummies', function () {
            this.on('dummies.product_id', '=', 'products.id')
                .andOn(db.raw('dummies.period_type = ?', [period_type]))
                .andOn(db.raw('dummies.trx_type = ?', [trx_type]))
        })
        .where('products.user_id', user_id)
        .andWhere('products.deleted', false)
        .select(
            'products.id as product_id',
            'products.product_name',
            'dummies.id as dummy_id',
            'dummies.fake_json'
        )
}

export async function insertDummy(data: IDummiesTable) {
    const [id] = await db<IDummiesTable>('dummies').insert(data)
    return id
}

export function updateDummy(id: IDummiesTable['id'], data: IDummiesTable) {
    return db<IDummiesTable>('dummies').where({ id }).update(data)
}

export function selectDummy(product_id: IDummiesTable['product_id'], period_type: IDummiesTable['period_type'], trx_type: IDummiesTable['trx_type']) {
    return db<IDummiesTable>('dummies')
        .where({ product_id, period_type, trx_type })
        .first()
}