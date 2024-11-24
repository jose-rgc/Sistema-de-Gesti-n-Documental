const User = require('../models/User');

// Registrar un usuario
const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body; // Asegúrate de recibir el rol en la solicitud

    try {
        // Verificar si el usuario ya existe
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        // Validar el rol
        if (!['developer', 'director', 'admin', 'archiver'].includes(role)) {
            return res.status(400).json({ message: 'Rol inválido' });
        }

        // Crear un nuevo usuario
        const user = new User({ name, email, password, role });
        await user.save();

        res.status(201).json({ message: 'Usuario registrado con éxito', user });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar usuario', error });
    }
};

// Obtener todos los usuarios
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Excluir el campo password
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los usuarios', error });
    }
};
const updateUser = async (req, res) => {
    const { id } = req.params; // Obtener el ID del usuario desde la URL
    const { name, email, role } = req.body;

    try {
        // Validar el rol
        if (!['developer', 'director', 'admin', 'archiver'].includes(role)) {
            return res.status(400).json({ message: 'Rol inválido' });
        }

        // Buscar y actualizar el usuario
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { name, email, role },
            { new: true, runValidators: true } // Retornar el usuario actualizado y validar cambios
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json({ message: 'Usuario actualizado con éxito', updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el usuario', error });
    }
};
// Obtener un usuario por ID
const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id).select('-password'); // Excluir la contraseña
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el usuario', error });
    }
};
// Eliminar un usuario por ID
const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json({ message: 'Usuario eliminado con éxito' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el usuario', error });
    }
};

module.exports = { getAllUsers, registerUser, updateUser, getUserById, deleteUser };



