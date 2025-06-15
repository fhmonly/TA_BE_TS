import { db } from "../../database/MySQL";
import { IPurchaseTable } from "../../types/db-model";

export function selectThisYearRestockTrendMonthly(
    user_id: IPurchaseTable['user_id']
) {
    return db('restocks')
        .select(
            db.raw('YEAR(buying_date) AS year'),
            db.raw('MONTH(buying_date) AS month'),
            db.raw('SUM(amount) AS amount')
        )
        .whereRaw('YEAR(buying_date) = YEAR(CURDATE())')
        .andWhere({ user_id })
        .groupByRaw('YEAR(buying_date), MONTH(buying_date)')
        .orderByRaw('YEAR(buying_date), MONTH(buying_date)')
}

export function selectThisYearRestockTrendWeekly(
    user_id: IPurchaseTable['user_id']
) {
    return db('restocks')
        .select(
            db.raw('YEAR(buying_date) AS year'),
            db.raw('WEEK(buying_date, 1) AS week'),
            db.raw('SUM(amount) AS amount')
        )
        .whereRaw('YEAR(buying_date) = YEAR(CURDATE())')
        .andWhere({ user_id })
        .groupByRaw('YEAR(buying_date), WEEK(buying_date, 1)')
        .orderByRaw('YEAR(buying_date), WEEK(buying_date, 1)')
}
