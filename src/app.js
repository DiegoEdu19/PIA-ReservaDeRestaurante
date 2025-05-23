import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import ubicacionRouter from './routes/ubicacion.routes.js';
import menuRouter from './routes/menu.routes.js';
import usersRouter from './routes/users.routes.js';
import user_opRouter from './routes/gestionUsuarios.routes.js';
import reportesRouter from './routes/gestionReservas.routes.js';
import gestionHorarios from './routes/gestionHorarios.routes.js';
import gestionDisponibilidad from './routes/gestionDisponibilidad.routes.js';
import gestionMenuRouter from './routes/gestionMenu.routes.js';
import authenticationRoutes from "./routes/authentication.routes.js";

// Necesario para __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;
app.use(express.json());

// Servir archivos estáticos desde public/
app.use(express.static(path.join(__dirname, '../public')));
app.use('/assets', express.static(path.join(__dirname, '../public/assets')));
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
app.use(gestionMenuRouter);
app.use(authenticationRoutes);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}/`);
});