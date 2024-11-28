const mongoose = require('mongoose');
const Employee = require('../models/Employee');



const registerEmployee = async (req, res) => {
    const { ci, firstName, lastName, phone, position, unit, startDate, endDate } = req.body;

    try {
        // Verificar que no exista un funcionario con la misma cédula
        const existingEmployee = await Employee.findOne({ ci });
        if (existingEmployee) {
            return res.status(400).json({ message: 'El funcionario ya está registrado' });
        }

        // Crear un nuevo funcionario
        const employee = new Employee({
            ci,
            firstName,
            lastName,
            phone,
            position,
            unit,
            startDate,
            endDate,
        });

        await employee.save();

        res.status(201).json({ message: 'Funcionario registrado con éxito', employee });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar al funcionario', error });
    }
};
// Listar funcionarios
const getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find().select('_id ci firstName lastName documents unit position'); // Excluye documentos por ahora
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los funcionarios', error });
    }
};
// Editar un Funcionario
const updateEmployee = async (req, res) => {
    const { id } = req.params;
    const { ci, firstName, lastName, phone, position, unit, startDate, endDate } = req.body;

    try {
        // Buscar y actualizar el funcionario
        const updatedEmployee = await Employee.findByIdAndUpdate(
            id,
            { ci, firstName, lastName, phone, position, unit, startDate, endDate },
            { new: true, runValidators: true } // Retornar el registro actualizado y validar cambios
        );

        if (!updatedEmployee) {
            return res.status(404).json({ message: 'Funcionario no encontrado' });
        }

        res.status(200).json({ message: 'Funcionario actualizado con éxito', updatedEmployee });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el funcionario', error });
    }
};
// Obtener un empleado por ID
const getEmployeeById = async (req, res) => {
    const { id } = req.params; // Obtener el ID del funcionario desde la URL
    console.log('ID recibido:', id); // Verifica que el ID es correcto
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'ID inválido' }); // Retornar error si el ID no es válido
    }
    try {
        const employee = await Employee.findById(id); // Buscar al empleado por su ID

        if (!employee) {
            return res.status(404).json({ message: 'Funcionario no encontrado' });
        }

        res.status(200).json(employee); // Devolver los datos del funcionario
    } catch (error) {
        console.error('Error al obtener los datos del funcionario:', error);
        res.status(500).json({ message: 'Error al obtener los datos del funcionario', error });
    }
};

// recuperar los datos del funcionario para GEstion de Documentos

const getEmployeesWithDocuments = async (req, res) => {
    try {
        console.log("Iniciando consulta de empleados con documentos...");

        // Obtener los empleados con los campos necesarios
        const employees = await Employee.find().select('_id ci firstName lastName documents');
        console.log('Empleados encontrados:', employees);

        if (!employees || employees.length === 0) {
            console.log("No se encontraron empleados.");
            return res.status(404).json({ message: "No se encontraron empleados." });
        }

        // Definir los tipos de documentos
        const defaultDocuments = [
            "Carnet de Identidad", "Certificado de Nacimiento", "Certificado de Matrimonio",
            "Libreta Militar", "Croquis de domicilio", "Curriculum", "Titulo Provisión Nacional",
            "Diploma Académico", "Rejap", "Cenvi", "Declaración de Notaria",
            "Certificado Médico", "NIT", "Declaración de Bienes y Rentas", "Memorandums"
        ];

        // Procesar cada empleado
        const employeesWithDocuments = employees.map(employee => {
            const documentStatuses = {};

            // Validar si el campo documents es un Mapxxx
           
            if (employee.documents instanceof Map) {
                employee.documents.forEach((status, docName) => {
                    documentStatuses[docName] = status;
                });
            }

            

            // Asegurar que todos los documentos estén presentes
            defaultDocuments.forEach(doc => {
                if (!documentStatuses.hasOwnProperty(doc)) {
                    documentStatuses[doc] = 'Pendiente'; // Estado por defecto
                }
            });

            return {
                _id: employee._id,
                ci: employee.ci,
                firstName: employee.firstName,
                lastName: employee.lastName,
                documents: documentStatuses
            };
        });

        console.log('Empleados con documentos procesados:', employeesWithDocuments);

        // Responder con la lista de empleados y sus documentos
        res.status(200).json(employeesWithDocuments);
    } catch (error) {
        console.error('Error al obtener los datos del funcionario:', error);
        res.status(500).json({ message: 'Error al obtener la lista de funcionarios y documentos', error });
    }
};
const updateEmployeeDocuments = async (req, res) => {
    const { employeeId } = req.params;
    const updates = req.body;

    try {
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ message: 'Funcionario no encontrado' });
        }

        // Actualizar los estados de los documentos
        Object.entries(updates).forEach(([docName, status]) => {
            employee.documents.set(docName, status);
        });

        await employee.save();

        res.status(200).json({ message: 'Documentos actualizados con éxito', documents: employee.documents });
    } catch (error) {
        console.error('Error al actualizar los documentos:', error);
        res.status(500).json({ message: 'Error al actualizar los documentos', error });
    }
};


module.exports = { registerEmployee,  getEmployees, updateEmployee, getEmployeeById, getEmployeesWithDocuments, updateEmployeeDocuments };