import { IUser } from "../../db-model";
import { TAccessToken } from "../../jwt";

declare module "express-serve-static-core" {
    interface Request {
        user?: TAccessToken;
    }
}