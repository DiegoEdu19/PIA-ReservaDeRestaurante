import express from 'express';
import {
  getEmpleados,
  agregarEmpleado,
  editarEmpleado,
  eliminarEmpleado
} from '../controllers/gestionUsuarios.controllers.js';

const router = express.Router();

router.get('/usuarios', (req, res) => {
  res.render('Admin/gestionUsuarios');
});

router.get('/api/usuarios', getEmpleados);
router.post('/agregarUsuarios', agregarEmpleado);
router.put('/usuarios/:id', editarEmpleado);
router.delete('/usuarios/:id', eliminarEmpleado);

export default router;