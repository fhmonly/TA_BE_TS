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
    deleted: boolean;
    low_stock_limit: number;
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
    price: number;
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
    price: number
}

export interface IPredictionTable {
    id: number;
    prediction: number[] | string;
    lower_bound: number[] | string;
    upper_bound: number[] | string;
    rmse: number;
    mape: number;
    product_id: number;
    user_id: number;
    expired: string; // bisa juga pakai `Date` kalau langsung di-parse
    period_type: 'weekly' | 'monthly';
    prediction_source: 'sales' | 'purchases';
}

export interface IPredictionModelTable {
    id: number;
    ar_p: number;
    ma_q: number;
    differencing_d: number;
    period_type: 'weekly' | 'monthly';
    prediction_source: 'sales' | 'purchases';
    expired: string; // bisa juga pakai `Date` kalau langsung di-parse
    product_id: number;
    user_id: number;
}

export interface IDummiesTable {
    id: number;
    product_id: number;
    fake_json: number[] | null;
    period_type: 'weekly' | 'monthly';
    trx_type: 'sales' | 'purchases';
}