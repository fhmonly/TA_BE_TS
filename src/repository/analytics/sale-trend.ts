import { db } from "../../database/MySQL";

export function selectThisYearSalesTrendMonthly() {
    return db('transactions')
        .select(
            db.raw("YEAR(transaction_date) AS year"),
            db.raw("MONTH(transaction_date) AS month"),
            db.raw("SUM(amount) AS amount")
        )
        .whereRaw("YEAR(transaction_date) = YEAR(CURDATE())") // filter tahun ini
        .groupByRaw("YEAR(transaction_date), MONTH(transaction_date)")
        .orderByRaw("YEAR(transaction_date), MONTH(transaction_date)")
}

export function selectThisYearSalesTrendWeekly() {
    return db('transactions')
        .select(
            db.raw("YEAR(transaction_date) AS year"),
            db.raw("WEEK(transaction_date, 1) AS week"), // mode 1: ISO week (Senin awal minggu)
            db.raw("SUM(amount) AS amount")
        )
        .whereRaw("YEAR(transaction_date) = YEAR(CURDATE())")
        .groupByRaw("YEAR(transaction_date), WEEK(transaction_date, 1)")
        .orderByRaw("YEAR(transaction_date), WEEK(transaction_date, 1)")
}
