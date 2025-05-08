// repository/userFilesRepository.ts

import { db } from '../database/MySQL';
import { IUserFile } from '../types/db-model';

export const createUserFile = async (data: IUserFile) => {
    try {
        const [userFile] = await db('user_files').insert(data).returning('*');
        return userFile;
    } catch (err) {
        throw new Error('Error creating user file');
    }
};

export const getUserFileById = async (id: number) => {
    try {
        const userFile = await db('user_files').where({ id }).first();
        return userFile;
    } catch (err) {
        throw new Error('Error fetching user file');
    }
};

export const updateUserFileById = async (id: number, data: IUserFile) => {
    try {
        const [updatedUserFile] = await db('user_files').where({ id }).update(data).returning('*');
        return updatedUserFile;
    } catch (err) {
        throw new Error('Error updating user file');
    }
};

export const deleteUserFileById = async (id: number) => {
    try {
        const userFile = await db('user_files').where({ id }).del();
        return userFile;
    } catch (err) {
        throw new Error('Error deleting user file');
    }
};

export const getAllUserFiles = async () => {
    try {
        return await db('user_files');
    } catch (err) {
        throw new Error('Error fetching all user files');
    }
};
