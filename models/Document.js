const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    title: { type: String, required: true }, // Título del documento
    description: { type: String },          // Descripción opcional
    employee: {                             // Relación con el funcionario
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true,
    },
    filePath: { type: String, required: true }, // Ruta del archivo subido
    uploadDate: { type: Date, default: Date.now }, // Fecha de subida
});

module.exports = mongoose.model('Document', documentSchema);
