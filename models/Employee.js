// models/Employee.js
const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    ci: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String },
    position: { type: String },
    unit: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    documents: {
        type: Map,
        of: String,
        default: {
            "Carnet de Identidad": "Pendiente",
            "Certificado de Nacimiento": "Pendiente",
            "Certificado de Matrimonio": "Pendiente",
            "Libreta Militar": "Pendiente",
            "Croquis de domicilio": "Pendiente",
            "Curriculum": "Pendiente",
            "Titulo Provisión Nacional": "Pendiente",
            "Diploma Académico": "Pendiente",
            "Rejap": "Pendiente",
            "Cenvi": "Pendiente",
            "Declaración de Notaria": "Pendiente",
            "Certificado Médico": "Pendiente",
            "NIT": "Pendiente",
            "Declaración de Bienes y Rentas": "Pendiente",
            "Memorandums": "Pendiente"
        }
    }
});

const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;




