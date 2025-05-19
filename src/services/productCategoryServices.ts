import { insertProductCategory, selectAllProductCategory, selectProductCategoryById, selectProductCategoryByName } from "../repository/productCategoriesRepository";
import { selectProductByCategoryId } from "../repository/productsRepository";
import { IProductCategoryTable } from "../types/db-model";

export const createProductCategory = (data: IProductCategoryTable) => insertProductCategory(data)

export const showAllProductCategory = (user_id: IProductCategoryTable['user_id']) => selectAllProductCategory(user_id)

export const deleteProductCategory = async (id: IProductCategoryTable['id'], user_id: IProductCategoryTable['user_id']) => {
    const otherCategory = await selectProductCategoryByName('Other').first()
    let otherCategoryId = otherCategory?.id
    if (!otherCategoryId) {
        otherCategoryId = await createProductCategory({
            category_name: 'Other',
            user_id,
        } as IProductCategoryTable)
    }
    await selectProductByCategoryId(id).where({
        product_category_id: id
    }).update({
        product_category_id: otherCategoryId
    })
    return selectProductCategoryById(id).delete()
}

export const updateProductCategoryById = async (id: IProductCategoryTable['id'], data: IProductCategoryTable) => selectProductCategoryById(id).update(data)