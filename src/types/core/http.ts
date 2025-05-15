export type TAPIResponse<T = Record<string, any>> = {
    success: boolean;
    message?: string;
    error?: Record<string, any>,
    data?: T;
};

interface TPaginatedResult<T> {
    data: T[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export type TPaginatedResponse<T = Record<string, any>> =
    TAPIResponse<TPaginatedResult<T>>
