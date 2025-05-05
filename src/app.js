const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

const ubicacionRouter = require('./routers/ubicacion.routes');
const menuRouter = require('./routers/menu.routes');
const usersRouter = require('./routers/users.routes');
const user_opRouter = require('./routers/gestionUsuarios.routes');
const reportesRouter =require('./routers/gestionReservas.routes');
const gestionHorarios = require('./routers/gestionHorarios.routes');
const gestionDisponibilidad = require('./routers/gestionDisponibilidad.routes');

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

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto http://localhost:${port}/`);
});