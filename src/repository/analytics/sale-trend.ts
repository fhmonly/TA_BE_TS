import { db } from "../../database/MySQL";
import { ITransactionTable } from "../../types/db-model";

export function selectThisYearSalesTrendMonthly(
    user_id: ITransactionTable['user_id']

) {
    return db('transactions')
        .select(
            db.raw("YEAR(transaction_date) AS year"),
            db.raw("MONTH(transaction_date) AS month"),
            db.raw("SUM(amount) AS amount")
        )
        .whereRaw("YEAR(transaction_date) = YEAR(CURDATE())") // filter tahun ini
        .andWhere({ user_id })
        .groupByRaw("YEAR(transaction_date), MONTH(transaction_date)")
        .orderByRaw("YEAR(transaction_date), MONTH(transaction_date)")
}

export function selectThisYearSalesTrendWeekly(
    user_id: ITransactionTable['user_id']
) {
    return db('transactions')
        .select(
            db.raw("YEAR(transaction_date) AS year"),
            db.raw("WEEK(transaction_date, 1) AS week"), // mode 1: ISO week (Senin awal minggu)
            db.raw("SUM(amount) AS amount")
        )
        .whereRaw("YEAR(transaction_date) = YEAR(CURDATE())")
        .andWhere({ user_id })
        .groupByRaw("YEAR(transaction_date), WEEK(transaction_date, 1)")
        .orderByRaw("YEAR(transaction_date), WEEK(transaction_date, 1)")
}
