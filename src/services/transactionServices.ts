import { countSales, insertsDataToTransaction, selectAllSalesHistory } from "../repository/transaction/sales";
import { IProductTable, ITransactionTable } from "../types/db-model";
import { getProductByProductCodes, updateProductById } from "./productServices";

export async function addTransactionRecords(data: {
    product_code: string;
    product_name: string;
    price: number;
    amount: number;
}[], user_id: IProductTable['user_id']) {
    const product_codes = data.map(v => v.product_code)
    const products = await getProductByProductCodes(user_id, product_codes)
    const mergedData: Partial<ITransactionTable>[] = []
    products.forEach((p) => {
        const pCode = p.product_code
        const dataMatched = data.find(v => v.product_code === pCode)
        mergedData.push({
            amount: dataMatched!.amount,
            product_id: p.id,
            user_id,
            price: Number(p.selling_price),
        })

        const stockAfter = p.stock - (Number(dataMatched?.amount) || 0)
        updateProductById(p.id, {
            stock: stockAfter < 1 ? 0 : stockAfter
        })
    })
    return insertsDataToTransaction(mergedData)
}

export async function showSalesHistory(
    user_id: ITransactionTable['user_id'],
    page = 1,
    limit = 10
) {
    const safePage = Math.max(1, Number(page));
    const safeLimit = Math.max(1, Number(limit));
    const offset = (safePage - 1) * safeLimit;

    const [data, total] = await Promise.all([
        selectAllSalesHistory(user_id, safeLimit, offset),
        countSales(user_id)
    ]);

    return {
        data,
        meta: {
            page: safePage,
            limit: safeLimit,
            total,
            totalPages: Math.ceil(total / safeLimit)
        }
    };
    return
}