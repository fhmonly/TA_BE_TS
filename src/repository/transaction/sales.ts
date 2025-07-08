import { db } from "../../database/MySQL";
import { ITransactionTable } from "../../types/db-model";
import { getStartOfMonth, getStartOfWeek } from "../../utils/core/date";

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

export const selectLastMonthSales = async (user_id: number) => {
    return db('transactions')
        .whereRaw('MONTH(transaction_date) = MONTH(CURRENT_DATE() - INTERVAL 1 MONTH) AND YEAR(transaction_date) = YEAR(CURRENT_DATE() - INTERVAL 1 MONTH)')
        .andWhere('user_id', user_id)
        .sum('total_price as total')
        .first<{
            total: number
        }>();
}

export const selectCurrentMonthSales = async (user_id: number) => {
    return db('transactions')
        .whereRaw('MONTH(transaction_date) = MONTH(CURRENT_DATE()) AND YEAR(transaction_date) = YEAR(CURRENT_DATE())')
        .andWhere('user_id', user_id)
        .sum('total_price as total')
        .first<{
            total: number
        }>();
}

export function selectGroupedDailySales(
    productId: ITransactionTable['product_id'],
    endOfPeriod: 'last-week' | 'last-month'
) {
    let startOfDay
    if (endOfPeriod === 'last-month')
        startOfDay = getStartOfMonth(new Date()).toISOString()
    else (endOfPeriod === 'last-week')
    startOfDay = getStartOfWeek(new Date()).toISOString()

    return db<ITransactionTable>('transactions')
        .select(
            db.raw('DATE(transaction_date) AS date'),
            db.raw('SUM(amount) AS total_amount')
        )
        .where('product_id', productId)
        .andWhere('transaction_date', '<', startOfDay)
        .groupByRaw('DATE(transaction_date)')
        .orderBy('date');
}

export function selectGroupedWeeklySales(productId: ITransactionTable['product_id']) {
    return db('transactions')
        .select(
            db.raw("YEAR(transaction_date) as year"),
            db.raw("WEEK(transaction_date, 1) as week"),
            db.raw("SUM(amount) as amount")
        )
        .where('product_id', productId)
        .andWhere('transaction_date', '<', getStartOfWeek(new Date()).toISOString())

        .groupBy(['year', 'week'])
        .orderBy(['year', 'week'])
}

export function selectGroupedMonthlySales(productId: ITransactionTable['product_id']) {
    return db('transactions')
        .select(
            db.raw("YEAR(transaction_date) as year"),
            db.raw("MONTH(transaction_date) as month"),
            db.raw("SUM(amount) as amount")
        )
        .where('product_id', productId)
        .andWhere('transaction_date', '<', getStartOfMonth(new Date()).toISOString())


        .groupBy(['year', 'month'])
        .orderBy(['year', 'month'])
}