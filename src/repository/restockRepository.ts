import { db } from "../database/MySQL";
import { IPurchaseTable } from "../types/db-model";

export function insertsDataToRestock(data: Partial<IPurchaseTable>[]) {
    return db<IPurchaseTable>('restocks').insert(data)
}

export function selectAllRestockHistory(
    user_id: IPurchaseTable['user_id'],
    limit: number, offset: number
) {
    return db<IPurchaseTable>('restocks as r')
        .leftJoin('products as p', 'p.id', 'r.product_id')
        .select('r.id', 'p.product_name', 'r.buying_date', 'r.price', 'r.amount', 'r.total_price')
        .where('p.user_id', user_id)
        .limit(limit)
        .offset(offset);
}

export const countRestocks = async (id_user: number) => {
    const result = await db('restocks')
        .where({ user_id: id_user })
        .count('id as count')
        .first<{
            count: string;
        }>();

    return parseInt(result?.count || '0');
};