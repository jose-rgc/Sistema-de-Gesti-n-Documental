const express = require('express');
const router = express.Router();
const { uploadDocument, getDocumentsByEmployee, updateEmployeeDocuments } = require('../controllers/documentController');
const { protect, verifyRole } = require('../middlewares/authMiddleware');

// Middleware para manejar la subida de archivos (asegúrate de tener multer configurado)
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Ruta donde se almacenarán los archivos

// Subir documentos (developer, admin y archiver)
router.post(
    '/upload',
    protect,
    verifyRole(['developer', 'admin', 'archiver']),
    upload.fields([
        { name: 'file-Carnet de Identidad', maxCount: 1 },
        { name: 'file-Certificado de Nacimiento', maxCount: 1 },
        { name: 'file-Certificado de Matrimonio', maxCount: 1 },
        { name: 'file-Libreta Militar', maxCount: 1 },
        { name: 'file-Croquis de Domicilio	', maxCount: 1 },
        { name: 'file-Curriculum', maxCount: 1 },
        { name: 'file-Titulo Provisión Nacional', maxCount: 1 },
        { name: 'file-Diploma Académico	', maxCount: 1 },
        { name: 'file-Rejap', maxCount: 1 },
        { name: 'file-Cenvi', maxCount: 1 },
        { name: 'file-Declaración de Notaria', maxCount: 1 },
        { name: 'file-Certificado Médico', maxCount: 1 },
        { name: 'file-NIT', maxCount: 1 },
        { name: 'file-Declaración de Bienes y Rentas', maxCount: 1 },
        { name: 'file-Memorandums', maxCount: 1 },
    ]),    uploadDocument
);
// Actualizar el estado de los documentos (developer, admin, archiver)
router.put('/employee/:employeeId/documents', protect, verifyRole(['developer', 'admin', 'archiver']), updateEmployeeDocuments);

// Listar documentos de un funcionario (developer y director)
router.get('/employee/:employeeId', protect, verifyRole(['developer', 'director']), getDocumentsByEmployee);

module.exports = router;




