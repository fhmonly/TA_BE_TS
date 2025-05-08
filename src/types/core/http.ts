export type TAPIResponse<T = Record<string, any>> = {
    success: boolean;
    message?: string;
    error?: Record<string, any>,
    data?: T;
};

export type TPaginatedResponse<T = Record<string, any>> = TAPIResponse<T> & {
    pagination?: {
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    }
};