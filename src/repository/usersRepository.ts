import { db } from "../database/MySQL"
import { IUserTable } from "../types/db-model"
import { TCreateUserRequest } from "../types/request/users-req";

export const findUserById = (id: number) => {
    return db<IUserTable>('users').where({ id });
};

export const findUserByEmail = (email: string) => {
    return db<IUserTable>('users').where({ email })
}

export const findUserByRefreshToken = (refresh_token: string) => {
    return db<IUserTable>('users').where({ refresh_token });
}

export const updateUserByCondition = (condition: Partial<IUserTable>, data: Partial<IUserTable>) => {
    return db<IUserTable>('users').where(condition).update(data)
}

export const createUser = async ({ email, name, password }: TCreateUserRequest) => {
    const [id] = await db<IUserTable>('users').insert({
        email,
        name,
        password,
    });
    return id
};