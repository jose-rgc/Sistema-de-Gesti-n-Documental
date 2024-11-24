const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config(); // Cargar variables de entorno
connectDB(); // Conectar a MongoDB

const app = express();

// Middlewares
app.use(cors()); // Habilitar CORS
app.use(express.json()); // Parsear JSON

// Rutas
const userRoutes = require('./routes/userRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const documentRoutes = require('./routes/documentRoutes');
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); // Rutas de usuarios
app.use('/api/employees', employeeRoutes); // Rutas de funcionarios
app.use('/api/documents', documentRoutes); // Rutas de documentos
app.use('/uploads', express.static('uploads'));


// Ruta de prueba (base)
app.get('/', (req, res) => {
    res.send('¡Servidor funcionando!');
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});


