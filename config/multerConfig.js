const multer = require('multer');
const path = require('path');

// Configuración del almacenamiento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Carpeta donde se guardarán los archivos
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}-${file.originalname}`); // Nombre único para cada archivo
    },
});

// Configuración de Multer
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Tamaño máximo del archivo: 5MB
    fileFilter: (req, file, cb) => {
        const fileTypes = /pdf|doc|docx|jpg|jpeg|png/; // Tipos permitidos
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos de tipo PDF, DOC, DOCX, JPG, JPEG o PNG'));
        }
    },
});

module.exports = upload;