import { db } from "../database/MySQL";
import { IProductTable } from "../types/db-model";

export const insertProduct = async (data: IProductTable) => {
    const [id] = await db<IProductTable>('products').insert(data)
    return id
}

export const selectProductsByUserId = (user_id: IProductTable['user_id']) => {
    return db<IProductTable>('products').where({ user_id })
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