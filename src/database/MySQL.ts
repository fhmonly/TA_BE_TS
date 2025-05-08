import knex from 'knex';
import dotenv from 'dotenv';
dotenv.config();

const {
    DB_USERNAME,
    DB_PASSWORD,
    DB_DATABASE,
    DB_HOST = 'localhost',
} = process.env;

if (!DB_USERNAME || !DB_DATABASE) {
    throw new Error("Missing required environment variables: DB_USERNAME, DB_PASSWORD, DB_DATABASE");
}

const db = knex({
    client: 'mysql2',
    connection: {
        host: DB_HOST,
        user: DB_USERNAME,
        password: DB_PASSWORD,
        database: DB_DATABASE,
    },
    pool: { min: 0, max: 10 },
});

async function connectDB() {
    try {
        await db.raw('SELECT 1');
        console.log('✅ Connected to MySQL using Knex');
    } catch (error) {
        console.error('❌ MySQL Connection Error:', error);
        process.exit(1);
    }
}

export { db };
export default connectDB;