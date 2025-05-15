import { countSuppliers, deleteSupplierById, getAllSupplier, getSupplierById, insertSupplier, updateSupplierById } from "../repository/suppliersRepository";
import { ISupplierTable } from "../types/db-model";

export const createSupplier = async (data: ISupplierTable) => insertSupplier(data)
export const getSuppliers = async (
    id_user: number,
    page = 1,
    limit = 10
) => {
    const safePage = Math.max(1, Number(page));
    const safeLimit = Math.max(1, Number(limit));
    const offset = (safePage - 1) * safeLimit;

    const [data, total] = await Promise.all([
        getAllSupplier(id_user, safeLimit, offset),
        countSuppliers(id_user)
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
export const getSupplier = async (id: number) => getSupplierById(id).first()
export const updateSupplier = async (id: number, data: ISupplierTable) => updateSupplierById(id, data)
export const deleteSupplier = async (id: number) => deleteSupplierById(id)