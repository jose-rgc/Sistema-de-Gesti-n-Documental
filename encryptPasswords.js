const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // Asegúrate de que la ruta sea correcta
require('dotenv').config();

const updatePasswords = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const users = await User.find();
        for (const user of users) {
            if (!user.password.startsWith('$2a$')) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
                await user.save();
                console.log(`Contraseña encriptada para el usuario: ${user.email}`);
            }
        }

        console.log('Todas las contraseñas fueron encriptadas correctamente.');
        mongoose.connection.close();
    } catch (error) {
        console.error('Error al actualizar contraseñas:', error);
        mongoose.connection.close();
    }
};

updatePasswords();
