const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generar un token JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Controlador para iniciar sesión
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log('Inicio de sesión solicitado:', { email, password });

        // Buscar al usuario por correo
        const user = await User.findOne({ email });
        console.log('Usuario encontrado:', user);

        if (!user) {
            console.log('El usuario no existe');
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Verificar contraseña
        const isMatch = await user.matchPassword(password);
        console.log('Resultado de la comparación de contraseñas:', isMatch);

        if (!isMatch) {
            console.log('La contraseña no coincide');
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Devolver token y datos del usuario
        const token = generateToken(user._id);
        console.log('Token generado:', token);

        res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token,
        });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ message: 'Error al iniciar sesión', error });
    }
};

module.exports = { loginUser };
