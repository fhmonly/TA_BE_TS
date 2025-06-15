import { db } from "../database/MySQL";
import { IProductTable } from "../types/db-model";

export const insertProduct = async (data: IProductTable) => {
    const [id] = await db<IProductTable>('products').insert(data)
    return id
}

export const selectProductsByUserId = (user_id: IProductTable['user_id']) => {
    return db<IProductTable>('products').where('products.user_id', user_id)
}

export const selectProductById = (id: IProductTable['id']) => {
    return db<IProductTable>('products').where({ id })
}

export const getAllProducts = (user_id: number, limit: number, offset: number) => {
    return db<IProductTable>('products as p')
        .leftJoin('product_categories as c', 'p.product_category_id', 'c.id')
        .select('p.*', 'c.category_name')
        .where('p.user_id', user_id)
        .where('p.deleted', false)
        .limit(limit)
        .offset(offset)
}

export const countProducts = async (id_user: number) => {
    const result = await db<IProductTable>('products')
        .where({ user_id: id_user, deleted: false })
        .count('id as count')
        .first<{
            count: string;
        }>();

    return parseInt(result?.count || '0');
};

export const selectProductByCategoryId = (product_category_id: IProductTable['product_category_id']) => {
    return db<IProductTable>('products').where({ product_category_id })
}

export const countProductsByCategory = async (product_category_id: IProductTable['product_category_id']) => {
    const result = await db<IProductTable>('products')
        .where({ product_category_id })
        .count('id as count')
        .first<{
            count: string;
        }>();

    return parseInt(result?.count || '0');
};

export const selectProductByProductCode = (product_code: IProductTable['product_code'], user_id: IProductTable['user_id']) => {
    return db<IProductTable>('products').where({
        product_code,
        user_id,
    })
}

export const selectProductByProductCodes = (product_codes: IProductTable['product_code'][], user_id: IProductTable['user_id']) => {
    return db<IProductTable>('products').where({
        user_id,
    }).whereIn('product_code', product_codes)
}

export function selectLowStockProducts(user_id: IProductTable['user_id']) {
    return db<IProductTable>('products as p')
        .leftJoin('product_categories as pc', 'pc.id', 'p.product_category_id')
        .select('p.id', 'p.product_name', 'p.stock', 'p.low_stock_limit', 'p.buying_price', 'pc.category_name')
        .whereRaw('p.stock < p.low_stock_limit')
        .andWhere('p.deleted', 0)
        .andWhere('p.user_id', user_id)
}

export function selectLowStockProductCount(user_id: IProductTable['user_id']) {
    return db('products')
        .where({ user_id: user_id, deleted: false })
        .whereRaw('stock < low_stock_limit')
        .count('id as total')
        .first<{
            total: number
        }>();
}

export function selectShortDataAllProduct(
    user_id: IProductTable['user_id']
) {
    return db<IProductTable>('products')
        .where({ user_id, deleted: false })
        .select(
            'product_code',
            'product_name'
        )
}