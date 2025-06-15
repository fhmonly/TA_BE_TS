import { db } from "../database/MySQL";
import { IPurchaseTable } from "../types/db-model";
import { getStartOfMonth, getStartOfWeek } from "../utils/core/date";

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

export const selectMonthlyRestockCount = (user_id: number) => {
    return db('restocks')
        .whereRaw('MONTH(buying_date) = MONTH(CURRENT_DATE()) AND YEAR(buying_date) = YEAR(CURRENT_DATE())')
        .andWhere('user_id', user_id)
        .sum('total_price as total')
        .first<{
            total: number
        }>();
}

export const selectLastMonthRestockCount = (user_id: number) => {
    return db('restocks')
        .whereRaw('MONTH(buying_date) = MONTH(CURRENT_DATE() - INTERVAL 1 MONTH) AND YEAR(buying_date) = YEAR(CURRENT_DATE() - INTERVAL 1 MONTH)')
        .andWhere('user_id', user_id)
        .sum('total_price as total')
        .first<{
            total: number
        }>();
}

export function selectGroupedWeeklyPurchase(productId: IPurchaseTable['product_id']) {
    return db<IPurchaseTable>('restocks')
        .select(
            db.raw("YEAR(buying_date) as year"),
            db.raw("WEEK(buying_date, 1) as week"),
            db.raw("SUM(amount) as amount")
        )
        .where('product_id', productId)
        .andWhere('buying_date', '<', getStartOfWeek(new Date()).toISOString())
        .groupBy(['year', 'week'])
        .orderBy(['year', 'week'])
}

export function selectGroupedMonthlyPurchase(productId: IPurchaseTable['product_id']) {
    return db<IPurchaseTable>('restocks')
        .select(
            db.raw("YEAR(buying_date) as year"),
            db.raw("MONTH(buying_date) as month"),
            db.raw("SUM(amount) as amount")
        )
        .where('product_id', productId)
        .andWhere('buying_date', '<', getStartOfMonth(new Date()).toISOString())
        .groupBy(['year', 'month'])
        .orderBy(['year', 'month'])
}