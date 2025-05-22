import express from 'express';
import {
  getEmpleados,
  agregarEmpleado,
  editarEmpleado,
  eliminarEmpleado,
  obtenerRestaurantes,
  obtenerRoles,
  obtenerEmpleadoPorId
} from '../controllers/gestionUsuarios.controllers.js';

const router = express.Router();

router.get('/usuarios', (req, res) => {
  res.render('Admin/gestionUsuarios');
});

router.get('/api/usuarios', getEmpleados);
router.post('/agregarUsuarios', agregarEmpleado);
router.put('/usuarios/:id', editarEmpleado);
router.delete('/usuarios/:id', eliminarEmpleado);
router.get('/api/restaurantes', obtenerRestaurantes);
router.get('/api/roles', obtenerRoles);
router.get('/usuarios/:id', obtenerEmpleadoPorId);

export default router;