const express = require('express');
const router = express.Router();
const { loginUser } = require('../controllers/authController');

// Ruta para iniciar sesión
router.post('/login', loginUser);

module.exports = router;
