import { db } from "../../database/MySQL";

export function selectThisYearRestockTrendMonthly() {
    return db('restocks')
        .select(
            db.raw('YEAR(buying_date) AS year'),
            db.raw('MONTH(buying_date) AS month'),
            db.raw('SUM(amount) AS amount')
        )
        .whereRaw('YEAR(buying_date) = YEAR(CURDATE())')
        .groupByRaw('YEAR(buying_date), MONTH(buying_date)')
        .orderByRaw('YEAR(buying_date), MONTH(buying_date)')
}

export function selectThisYearRestockTrendWeekly() {
    return db('restocks')
        .select(
            db.raw('YEAR(buying_date) AS year'),
            db.raw('WEEK(buying_date, 1) AS week'),
            db.raw('SUM(amount) AS amount')
        )
        .whereRaw('YEAR(buying_date) = YEAR(CURDATE())')
        .groupByRaw('YEAR(buying_date), WEEK(buying_date, 1)')
        .orderByRaw('YEAR(buying_date), WEEK(buying_date, 1)')
}
