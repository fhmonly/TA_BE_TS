import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
import { TAccessToken, TRefreshToken } from '../../types/jwt';
import { IUserTable } from '../../types/db-model';
dotenv.config()

const isProd = process.env.NODE_ENV === 'production';

const generateAccessToken = (user: IUserTable) => {
    return jwt.sign(
        { id: user.id, email: user.email } as TAccessToken,
        process.env.JWT_SECRET,
        { expiresIn: isProd ? "15m" : '30d' }
    );
};

const generateRefreshToken = (user: IUserTable) => {
    return jwt.sign(
        { id: user.id } as TRefreshToken,
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "30d" }
    );
};

export {
    generateAccessToken,
    generateRefreshToken
}