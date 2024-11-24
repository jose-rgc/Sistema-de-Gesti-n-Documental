const express = require('express');
const router = express.Router();
const { registerEmployee, getEmployees, updateEmployee, getEmployeeById, getEmployeesWithDocuments, updateEmployeeDocuments } = require('../controllers/employeeController');
const { protect, verifyRole } = require('../middlewares/authMiddleware');

// Registrar funcionarios (solo developer y admin)
router.post('/register', protect, verifyRole(['developer', 'admin']), registerEmployee);


// Listar funcionarios (solo developer y director)
router.get('/', protect, verifyRole(['developer', 'director']), getEmployees);

// Actualizar funcionario
router.put('/:id', protect, verifyRole(['developer', 'admin']), updateEmployee); 

// Ruta para obtener funcionarios con sus documentos
router.get('/list-with-documents', protect, verifyRole(['developer', 'admin', 'director']), getEmployeesWithDocuments);

// Obtener funcionario por ID
router.get('/:id',protect, verifyRole(['developer', 'admin', 'director']), getEmployeeById); 

// Ruta para actualizar documentos de un empleado
router.put('/:employeeId/documents', protect, verifyRole(['developer', 'admin', 'archiver']), updateEmployeeDocuments);





module.exports = router;


