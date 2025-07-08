import { countProducts, selectLowStockProductCount } from "../repository/productsRepository"
import { selectLastMonthRestockCount, selectMonthlyRestockCount } from "../repository/transaction/purchase"
import { selectCurrentMonthSales, selectLastMonthSales } from "../repository/transaction/sales"
import { calculateGrowth } from '../utils/math/calculateGrowth'

export async function getDashboardData(user_id: number) {
    const total_product = await countProducts(user_id)
    const { total: total_low_stock } = await selectLowStockProductCount(user_id)
    const { total: total_last_month_sales } = await selectLastMonthSales(user_id)
    const { total: total_monthly_sales } = await selectCurrentMonthSales(user_id)
    const { total: total_last_month_restock } = await selectLastMonthRestockCount(user_id)
    const { total: total_monthly_restock } = await selectMonthlyRestockCount(user_id)
    return {
        total_product,
        total_low_stock,
        total_last_month_restock,
        total_monthly_restock,
        restock_growth: Number(calculateGrowth(Number(selectLastMonthRestockCount || 0), Number(total_monthly_restock || 0)).toFixed(2)),
        total_last_month_sales,
        total_monthly_sales,
        salesGrowth: Number(calculateGrowth(Number(total_last_month_sales || 0), Number(total_monthly_sales || 0)).toFixed(2)),
    }
}