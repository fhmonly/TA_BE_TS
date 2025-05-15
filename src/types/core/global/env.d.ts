declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: 'development' | 'production' | 'test';
        HOST: string;
        PORT: string;
        ALLOWED_ORIGIN: string;

        PYTHON_API_HOST: string;

        DB_CONNECTION: 'mysql' | string;
        DB_HOST: string;
        DB_PORT: string;
        DB_DATABASE: string;
        DB_USERNAME: string;
        DB_PASSWORD: string;

        ATLAS_USERNAME: string;
        ATLAS_PASSWORD: string;
        ATLAS_DBNAME: string;

        JWT_SECRET: string;
        JWT_REFRESH_SECRET: string;

        EMAIL_USER: string;
        EMAIL_PASS: string;
    }
}
