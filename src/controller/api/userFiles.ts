// controllers/userFilesController.ts

import { body, param, matchedData } from "express-validator";
import createHttpError from "http-errors";
import validate from "../../middleware/expressValidatorErrorHandler";  // Validation middleware
import * as userFilesRepository from "../../repository/user-files"; // Repository untuk User Files
import { NextFunction, Request, Response } from "express";
import { IUserFile } from "../../types/db-model";

// 🟢 **POST: Tambah User File Baru**
const createUserFile = [
    body("file_name").notEmpty().withMessage("File name is required"),
    body("saved_file_name").notEmpty().withMessage("Saved file name is required"),
    body("is_converted").optional().isBoolean().withMessage("is_converted must be a boolean"),
    body("user_id").notEmpty().isInt().withMessage("Invalid user ID"), // ganti isMongoId() ke isInt()
    validate,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = matchedData<IUserFile>(req);
            const userFile = await userFilesRepository.createUserFile(data);

            res.status(201).json({ message: "User file created", userFile });
        } catch (err) {
            next(createHttpError(500, "Internal Server Error", { cause: err }));
        }
    }
];

// 🟠 **PATCH: Perbarui File User**
const updateUserFile = [
    param("id").isInt().withMessage("Invalid file ID"), // ganti isMongoId() ke isInt()
    body("file_name").optional().isString(),
    body("saved_file_name").optional().isString(),
    body("is_converted").optional().isBoolean(),
    validate,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const data = matchedData<IUserFile>(req);

            const userFile = await userFilesRepository.updateUserFileById(Number(id), data);
            if (!userFile) return next(createHttpError(404, "User file not found"));

            res.json({ message: "User file updated", userFile });
        } catch (err) {
            next(createHttpError(500, "Internal Server Error", { cause: err }));
        }
    }
];

// 🔴 **DELETE: Hapus File User**
const deleteUserFile = [
    param("id").isInt().withMessage("Invalid file ID"), // ganti isMongoId() ke isInt()
    validate,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;

            const userFile = await userFilesRepository.deleteUserFileById(Number(id));
            if (!userFile) return next(createHttpError(404, "User file not found"));

            res.json({ message: "User file deleted" });
        } catch (err) {
            next(createHttpError(500, "Internal Server Error", { cause: err }));
        }
    }
];

// 🔵 **GET: Ambil Satu File User Berdasarkan ID**
const getUserFile = [
    param("id").isInt().withMessage("Invalid file ID"), // ganti isMongoId() ke isInt()
    validate,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const userFile = await userFilesRepository.getUserFileById(Number(id));

            if (!userFile) return next(createHttpError(404, "User file not found"));

            res.json(userFile);
        } catch (err) {
            next(createHttpError(500, "Internal Server Error", { cause: err }));
        }
    }
];

// 🟡 **GET: Ambil Semua File User**
const getUserFiles = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allUserFiles = await userFilesRepository.getAllUserFiles();
        res.json(allUserFiles);
    } catch (err) {
        next(createHttpError(500, "Internal Server Error", { cause: err }));
    }
};

export default {
    createUserFile,
    updateUserFile,
    deleteUserFile,
    getUserFile,
    getUserFiles
};