import { db } from "../database/MySQL";
import { IProductCategoryTable } from "../types/db-model";

export async function insertProductCategory(data: IProductCategoryTable) {
    const [id] = await db<IProductCategoryTable>('product_categories').insert(data)
    return id
}

export function selectAllProductCategory(user_id: IProductCategoryTable['user_id']) {
    return db<IProductCategoryTable>('product_categories').where({ user_id })
}

export function selectProductCategoryById(id: IProductCategoryTable['id']) {
    return db<IProductCategoryTable>('product_categories').where({ id })
}

export function selectProductCategoryByName(category_name: IProductCategoryTable['category_name']) {
    return db<IProductCategoryTable>('product_categories').where({ category_name })
}