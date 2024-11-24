const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware para proteger rutas y verificar el token
const protect = async (req, res, next) => {
    let token;

    // Verificar si hay un token en los encabezados
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extraer el token
            token = req.headers.authorization.split(' ')[1];

            // Verificar el token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Obtener el usuario asociado al token
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            next(); // Usuario autenticado
        } catch (error) {
            console.error('Error al verificar el token:', error);
            res.status(401).json({ message: 'No autorizado, token inválido' });
        }
    } else {
        res.status(401).json({ message: 'No autorizado, no se proporcionó un token' });
    }
};

// Middleware para verificar si el usuario tiene el rol necesario
const verifyRole = (roles) => {
    return async (req, res, next) => {
        try {
            // El usuario ya fue autenticado en el middleware `protect`
            if (!roles.includes(req.user.role)) {
                return res.status(403).json({ message: 'No tienes permiso para realizar esta acción' });
            }

            next(); // Usuario autorizado
        } catch (error) {
            res.status(500).json({ message: 'Error al verificar el rol', error });
        }
    };
};

module.exports = { protect, verifyRole };
