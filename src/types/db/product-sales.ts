import { IProductTable, ITransactionTable } from "../db-model";

export type TGroupedProductSales = {
    group_date: string;
    product_name: IProductTable['product_name'];
    product_code: IProductTable['product_code'];
    product_id: ITransactionTable['product_id'];
    total_transactions: number;
};
