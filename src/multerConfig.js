import multer from 'multer';
import path from 'path';
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/assets'));
    },
    filename: (req, file, cb) => {
        cb(null, "menu" + path.extname(file.originalname))
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten archivos PDF'), false);
    }
};

export const menuUpload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
}).single('menu');

