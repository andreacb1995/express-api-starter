//const app = require('./app');

const express = require('express');
const app = express();
const connection = require('./db'); // Importar la conexión a MySQL
const cors = require('cors'); // Importar cors
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

// Usar cors para permitir solicitudes desde cualquier origen (o especificar un origen)
app.use(cors());
app.use(bodyParser.json());  // Asegúrate de que el cuerpo de la solicitud esté parseado como JSON

// Ruta para obtener todos los usuarios
app.get('/usuarios', (req, res) => {
  const query = 'SELECT * FROM usuarios'; // Consulta para obtener todos los usuarios

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error al consultar los usuarios: ', err);
      res.status(500).json({ error: 'Error en la consulta' });
      return;
    }

    res.json(results); // Enviar los resultados en formato JSON
  });
});

// Ruta para obtener un usuario por su ID
app.get('/usuarios/:id', (req, res) => {
  const usuarioId = req.params.id;

  // Consulta SQL para obtener el usuario por ID
  const query = 'SELECT * FROM usuarios WHERE id = ?';
  connection.query(query, [usuarioId], (err, results) => {
    if (err) {
      console.error('Error al consultar el usuario:', err);
      return res.status(500).json({ error: 'Error al buscar el usuario' });
    }

    // Si no se encuentra el usuario, devolver un error
    if (results.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Si se encuentra el usuario, devolverlo
    res.json(results[0]); // Enviar el primer usuario encontrado
  });
});

// Ruta para crear un usuario
app.post('/crearusuario', (req, res) => {
  const { username, password } = req.body;

  // Verificar si el usuario ya existe en la base de datos
  const queryCheckUser = 'SELECT * FROM usuarios WHERE username = ?';

  connection.query(queryCheckUser, [username], (err, results) => {
    if (err) {
      console.error('Error al verificar el usuario:', err);
      return res.status(500).json({ error: 'Error al verificar el usuario' });
    }

    // Si el usuario ya existe, devolver un conflicto
    if (results.length > 0) {
      return res.status(409).json({ mensaje: 'El usuario ya existe.' });
    }

    // Validar que los datos necesarios estén presentes
    if (!username || !password) {
      return res.status(400).json({ error: 'El nombre de usuario y la contraseña son requeridos' });
    }

    // Hash de la contraseña antes de almacenarla
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error('Error al generar el hash de la contraseña:', err);
        return res.status(500).json({ error: 'Error al guardar el usuario' });
      }

      // Insertar el usuario en la base de datos
      const queryInsertUser = 'INSERT INTO usuarios (username, password) VALUES (?, ?)';
      connection.query(queryInsertUser, [username, hashedPassword], (err, results) => {
        if (err) {
          console.error('Error al insertar usuario:', err);
          return res.status(500).json({ error: 'Error al guardar el usuario' });
        }

        const nuevoUsuario = {
          id: results.insertId,  // Obtiene el ID generado automáticamente por la base de datos
          username: username,
          password: hashedPassword  // Asegúrate de que no devuelvas la contraseña en texto claro
        };

        // Enviar respuesta con el nuevo usuario
        res.status(201).json(nuevoUsuario);
      });
    });
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`Listening: http://localhost:${port}`);
  /* eslint-enable no-console */
});
