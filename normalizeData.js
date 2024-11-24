const mongoose = require('mongoose');
const Employee = require('./models/Employee'); // Ajusta la ruta según tu proyecto

mongoose.connect('mongodb://localhost:27017/sistema_gestion_documental', { useNewUrlParser: true, useUnifiedTopology: true });

(async () => {
    try {
        const employees = await Employee.find();

        for (const employee of employees) {
            const updatedDocuments = new Map();

            employee.documents.forEach((value, key) => {
                try {
                    // Si el valor ya es JSON, mantenerlo
                    JSON.parse(value);
                    updatedDocuments.set(key, value);
                } catch (error) {
                    // Si no es JSON, convertirlo
                    const newValue = value === 'Presento' || value === 'Pendiente'
                        ? JSON.stringify({ status: value })
                        : value;
                    updatedDocuments.set(key, newValue);
                }
            });

            employee.documents = updatedDocuments;
            await employee.save();
        }

        console.log('Datos normalizados con éxito');
        mongoose.connection.close();
    } catch (error) {
        console.error('Error al normalizar los datos:', error);
        mongoose.connection.close();
    }
})();
