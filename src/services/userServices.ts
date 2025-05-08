import { findUserByEmail, findUserById, findUserByRefreshToken, updateUserByCondition } from "../repository/usersRepository";
import { IUserTable } from "../types/db-model";

export const getUserById = (id: number) => findUserById(id).first()
export const getUserByEmail = (email: string) => findUserByEmail(email).first()
export const getUserByRefreshToken = (refresh_token: string) =>
    findUserByRefreshToken(refresh_token).first()
export const activateUser = (email: string) => findUserByEmail(email).update({ is_verified: true })
export const updateUserById = (id: number, data: Partial<IUserTable>) => updateUserByCondition({ id }, data)