export interface IUserTable {
    id: number;
    name: string;
    email: string;
    password: string;
    is_verified: boolean;
    refresh_token: string | null;
    created_at: Date;
    updated_at: Date;
}

export interface IProductCategoryTable {
    user_id: number;
    category_name: string;
    id: number;
}

export interface IProductTable {
    id: number;
    product_name: string;
    product_code: string;
    stock: number;
    buying_price: number | null;
    selling_price: number | null;
    product_category_id: number | null;
    user_id: number;
    deleted: boolean
}

export interface ISupplierTable {
    id: number;
    supplier_name: string;
    contact: string | null;
    address: string;
    user_id: number;
}

export interface IPurchaseTable {
    id: number;
    buying_date: Date;
    amount: number;
    total_price: number;
    user_id: number;
    product_id: number;
    supplier_id: number;
}

export interface ITransactionTable {
    id: number;
    transaction_date: Date;
    amount: number;
    total_price: number;
    user_id: number;
    product_id: number;
}

export interface IPredictionTable {
    id: number;
    stock_sold: number;
    stock_predicted: number;
    type: string;
    accuracy: number;
    user_id: number;
    product_id: number;
}

export interface IUserFileTable {
    id: number;
    file_name: string;
    saved_file_name: string;
    is_converted: boolean;
    user_id: number;
}
