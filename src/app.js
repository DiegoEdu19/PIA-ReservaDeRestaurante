const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

const ubicacionRouter = require('./routes/ubicacion.routes');
const menuRouter = require('./routes/menu.routes');
const usersRouter = require('./routes/users.routes');
const user_opRouter = require('./routes/gestionUsuarios.routes');
const reportesRouter =require('./routes/gestionReservas.routes');
const gestionHorarios = require('./routes/gestionHorarios.routes');
const gestionDisponibilidad = require('./routes/gestionDisponibilidad.routes');
const ubicacion = require('./routes/ubicacion.routes');

// Servir archivos estáticos desde public/
app.use(express.static(path.join(__dirname, '../public')));
app.use('/assets', express.static(path.join(__dirname, '../public')));

// Vistas EJS
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

// Rutas
app.use(usersRouter);
app.use(user_opRouter);
app.use(ubicacionRouter);
app.use(menuRouter);
app.use(reportesRouter);
app.use(gestionHorarios);
app.use(gestionDisponibilidad);
app.use(ubicacion);

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto http://localhost:${port}/`);
});