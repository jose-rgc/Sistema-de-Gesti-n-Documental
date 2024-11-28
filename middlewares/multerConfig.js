const multer = require('multer');

// Configura Multer para guardar los archivos en la carpeta 'uploads'
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ruta donde se guardarán los archivos
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Nombre único para evitar conflictos
  }
});

const upload = multer({ storage: storage });

// Ruta para subir un archivo
app.post('/upload', upload.single('document'), (req, res) => {
  // Guarda información del archivo en la base de datos si es necesario
  res.send('Archivo subido con éxito');
});


