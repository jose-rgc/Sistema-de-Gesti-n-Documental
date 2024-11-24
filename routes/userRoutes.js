const express = require('express');
const router = express.Router();
const { getAllUsers, registerUser, updateUser, getUserById, deleteUser } = require('../controllers/userController');
const { protect, verifyRole } = require('../middlewares/authMiddleware');

router.get('/', protect, verifyRole(['developer', 'admin']), getAllUsers); // Listar usuarios
router.post('/register', registerUser); // Registrar usuario
router.put('/:id', protect, verifyRole(['developer', 'admin']), updateUser); // Actualizar usuario
router.get('/:id', protect, verifyRole(['developer', 'admin']), getUserById); // Obtener usuario por ID
router.delete('/:id', protect, verifyRole(['developer', 'admin']), deleteUser); // Eliminar usuario


module.exports = router;

