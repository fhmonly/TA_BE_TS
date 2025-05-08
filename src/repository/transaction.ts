// repository/transactionsRepository.ts

import { db } from '../database/MySQL';
import { ITransaction } from '../types/db-model';

export const createTransaction = async (data: ITransaction) => {
    try {
        const [transaction] = await db('transactions').insert(data).returning('*');
        return transaction;
    } catch (err) {
        throw new Error('Error creating transaction');
    }
};

export const getTransactionById = async (id: number) => {
    try {
        const transaction = await db('transactions')
            .where({ id })
            .join('products', 'transactions.product_id', '=', 'products.id')
            .join('users', 'transactions.user_id', '=', 'users.id')
            .select('transactions.*', 'products.product_name', 'users.username');
        return transaction[0];
    } catch (err) {
        throw new Error('Error fetching transaction');
    }
};

export const updateTransactionById = async (id: number, data: ITransaction) => {
    try {
        const [updatedTransaction] = await db('transactions').where({ id }).update(data).returning('*');
        return updatedTransaction;
    } catch (err) {
        throw new Error('Error updating transaction');
    }
};

export const deleteTransactionById = async (id: number) => {
    try {
        const transaction = await db('transactions').where({ id }).del();
        return transaction;
    } catch (err) {
        throw new Error('Error deleting transaction');
    }
};

export const getAllTransactions = async () => {
    try {
        return await db('transactions')
            .join('products', 'transactions.product_id', '=', 'products.id')
            .join('users', 'transactions.user_id', '=', 'users.id')
            .select('transactions.*', 'products.product_name', 'users.username');
    } catch (err) {
        throw new Error('Error fetching all transactions');
    }
};
