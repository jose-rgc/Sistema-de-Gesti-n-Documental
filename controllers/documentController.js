const Document = require('../models/Document');
const Employee = require('../models/Employee');

// Controlador para subir documentos
const uploadDocument = async (req, res) => {
    const { employeeId } = req.body;

    if (!employeeId) {
        return res.status(400).json({ message: 'Faltan campos obligatorios: employeeId' });
    }

    try {
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ message: 'Funcionario no encontrado' });
        }

        // Procesar cada archivo subido
        Object.entries(req.files).forEach(([fieldName, files]) => {
            const documentName = fieldName.replace('file-', ''); // Extraer el nombre del documento
            const filePath = files[0].path;

            // Actualizar el estado del documento a "Presento"
            employee.documents.set(documentName, "Presento");
            console.log(`Archivo subido para ${documentName}: ${filePath}`);
        });

        await employee.save();

        res.status(200).json({ message: 'Documentos subidos con éxito' });
    } catch (error) {
        console.error('Error al subir el documento:', error);
        res.status(500).json({ message: 'Error al subir el documento', error });
    }
};







// Controlador para actualizar estados de los documentos
const updateEmployeeDocuments = async (req, res) => {
    const { employeeId } = req.params;
    const updates = req.body;

    try {
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ message: 'Funcionario no encontrado' });
        }

        Object.entries(updates).forEach(([docName, data]) => {
            // Si el dato es un string, significa que solo se está actualizando el estado
            if (typeof data === 'string') {
                employee.documents.set(docName, { status: data });
            } else if (data.status === 'Pendiente' && data.date) {
                // Si el estado es "Pendiente", se actualiza con la fecha
                employee.documents.set(docName, { status: data.status, date: data.date });
            }
        });

        await employee.save();
        res.status(200).json({ message: 'Documentos actualizados con éxito' });
    } catch (error) {
        console.error('Error al actualizar los documentos:', error);
        res.status(500).json({ message: 'Error al actualizar los documentos', error });
    }
};



// Controlador para obtener los documentos del empleado
const getDocumentsByEmployee = async (req, res) => {
    const { employeeId } = req.params;
    try {
        // Verificar que el funcionario exista
        const employee = await Employee.findById(employeeId);
        console.log(employee.documents);  // Verifica que los documentos estén correctamente guardados
        if (!employee) {
            return res.status(404).json({ message: 'Funcionario no encontrado' });
        }
        // Convertir el Map de documentos en un objeto estándar
        const documentsObject = {};
        employee.documents.forEach((status, docName) => {
            documentsObject[docName] = {
                status: status,
                fileName: status === 'Presento' ? `${docName}-file.pdf` : ''  // Aquí agregamos el nombre del archivo (puede ser un PDF)
            };
        });
        console.log('Documentos:', documentsObject);  // Verifica que los documentos estén en el formato esperado
        res.status(200).json({ documents: documentsObject });
    } catch (error) {
        console.error('Error al obtener los documentos:', error);
        res.status(500).json({ message: 'Error al obtener los documentos', error });
    }
};









module.exports = { uploadDocument, getDocumentsByEmployee, updateEmployeeDocuments };


