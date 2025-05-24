import { countRestocks, insertsDataToRestock, selectAllRestockHistory } from "../repository/restockRepository";
import { IProductTable, IPurchaseTable } from "../types/db-model";
import { getProductByProductCodes, updateProductById } from "./productServices";

export async function addRestocksRecords(data: {
    product_code: string;
    product_name: string;
    price: number;
    amount: number;
}[], user_id: IProductTable['user_id']) {
    const product_codes = data.map(v => v.product_code)
    const products = await getProductByProductCodes(user_id, product_codes)
    const mergedData: Partial<IPurchaseTable>[] = []
    products.forEach((p) => {
        const pCode = p.product_code
        const dataMatched = data.find(v => v.product_code === pCode)
        mergedData.push({
            amount: dataMatched!.amount,
            product_id: p.id,
            user_id,
            price: Number(p.buying_price),
        })
        updateProductById(p.id, {
            stock: p.stock + (Number(dataMatched?.amount) || 0)
        })
    })
    return insertsDataToRestock(mergedData)
}

export async function showRestockHistory(
    user_id: IPurchaseTable['user_id'],
    page = 1,
    limit = 10
) {
    const safePage = Math.max(1, Number(page));
    const safeLimit = Math.max(1, Number(limit));
    const offset = (safePage - 1) * safeLimit;

    const [data, total] = await Promise.all([
        selectAllRestockHistory(user_id, safeLimit, offset),
        countRestocks(user_id)
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