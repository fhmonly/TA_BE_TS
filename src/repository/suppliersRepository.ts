import { db } from "../database/MySQL"
import { ISupplierTable } from "../types/db-model"

export const insertSupplier = async ({
    address, contact, supplier_name, user_id
}: ISupplierTable) => {
    const [id] = await db<ISupplierTable>('suppliers').insert({
        supplier_name, contact, user_id, address
    })
    return id
}

export const getSupplierById = (id: number) => {
    return db<ISupplierTable>('suppliers').where({ id })
}

export const getAllSupplier = (user_id: number, limit: number, offset: number) => {
    return db<ISupplierTable>('suppliers')
        .select('*')
        .where({ user_id })
        .limit(limit)
        .offset(offset);
}

export const countSuppliers = async (id_user: number) => {
    const result = await db('suppliers')
        .where({ user_id: id_user })
        .count('id as count')
        .first<{
            count: string;
        }>();

    return parseInt(result?.count || '0');
};

export const updateSupplierById = (id: number, data: ISupplierTable) => {
    return getSupplierById(id).update(data)
}

export const deleteSupplierById = (id: number) => {
    return getSupplierById(id).delete()
}
