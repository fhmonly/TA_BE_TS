import { countProducts, getAllProducts, insertProduct, selectProductById, selectProductByProductCode, selectProductByProductCodes, selectProductsByUserId } from "../repository/productsRepository"
import { IProductTable } from "../types/db-model"

export const createProduct = async (data: IProductTable) => {
    const product = await selectProductByProductCode(data.product_code, data.user_id).first()
    if (product) {
        return await updateProductById(product.id, {
            deleted: false
        })
    } else {
        return await insertProduct(data)
    }
}
export const getProducts = async (
    id_user: number,
    page = 1,
    limit = 10
) => {
    const safePage = Math.max(1, Number(page));
    const safeLimit = Math.max(1, Number(limit));
    const offset = (safePage - 1) * safeLimit;

    const [data, total] = await Promise.all([
        getAllProducts(id_user, safeLimit, offset),
        countProducts(id_user)
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
};
export const showProductById = async (id: IProductTable['id']) => selectProductById(id).first()
export const updateProductById = async (id: IProductTable['id'], data: Partial<IProductTable>) => selectProductById(id).update(data)
export const deleteProductById = async (id: IProductTable['id']) => {
    return selectProductById(id).update({
        deleted: true
    })
}
export const getProductByProductCode = (
    user_id: IProductTable['user_id'],
    product_code: IProductTable['product_code']
) => selectProductByProductCode(product_code, user_id).first()

export const getProductByProductCodes = (
    user_id: IProductTable['user_id'],
    product_codes: IProductTable['product_code'][]
) => selectProductByProductCodes(product_codes, user_id)