import { db } from "../database/MySQL";
import { ITransactionTable } from "../types/db-model";

export function insertsDataToTransaction(data: Partial<ITransactionTable>[]) {
    return db<ITransactionTable>('transactions').insert(data)
}

export function selectAllSalesHistory(
    user_id: ITransactionTable['user_id'],
    limit: number, offset: number
) {
    return db<ITransactionTable>('transactions as t')
        .leftJoin('products as p', 'p.id', 't.product_id')
        .select('t.id', 'p.product_name', 't.transaction_date', 't.price', 't.amount', 't.total_price')
        .where('p.user_id', user_id)
        .limit(limit)
        .offset(offset);
}

export const countSales = async (id_user: number) => {
    const result = await db('transactions')
        .where({ user_id: id_user })
        .count('id as count')
        .first<{
            count: string;
        }>();

    return parseInt(result?.count || '0');
};