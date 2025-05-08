import { IUser } from "../../db-model";
import { TAccessToken } from "../../jwt";
import { TAPIResponse, TPaginatedResponse } from "../http";

declare module "express-serve-static-core" {
    interface Request {
        user?: TAccessToken;
    }
}