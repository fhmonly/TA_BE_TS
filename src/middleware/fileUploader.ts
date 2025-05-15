import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { root_path } from '../utils/core/storage';

const allowedExtensions = ['.xlsx', '.xls', '.csv', '.tsv', '.ods', '.json', '.txt', '.html', '.slk', '.dbf', '.prn', '.dif'];
const allowedMimeTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'text/csv',
    'application/vnd.oasis.opendocument.spreadsheet'
];

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = root_path('src/temp');
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const base = path.basename(file.originalname, ext);
        const timestamp = Date.now();
        cb(null, `${base}-${timestamp}${ext}`);
    }
});

export function fileValidate(fieldName: string) {
    return multer({
        storage,
        limits: { fileSize: 10 * 1024 * 1024 },
        fileFilter: (req, file, cb) => {
            const ext = path.extname(file.originalname).toLowerCase();
            const isValidMime = allowedMimeTypes.includes(file.mimetype);
            const isValidExt = allowedExtensions.includes(ext);

            if (!isValidMime || !isValidExt) {
                return cb(new Error('Unsupported file format for SheetJS') as any, false);
            }

            cb(null, true);
        }
    }).single(fieldName);
}

export function multiFileValidate(fields: multer.Field[]) {
    return multer({
        storage,
        limits: { fileSize: 10 * 1024 * 1024 },
        fileFilter: (req, file, cb) => {
            const ext = path.extname(file.originalname).toLowerCase();
            const isValidMime = allowedMimeTypes.includes(file.mimetype);
            const isValidExt = allowedExtensions.includes(ext);

            if (!isValidMime || !isValidExt) {
                return cb(new Error('Unsupported file format for SheetJS') as any, false);
            }

            cb(null, true);
        }
    }).fields(fields);
}
