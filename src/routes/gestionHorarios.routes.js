import express from 'express';
import { actualizarHorarios, obtenerHorarios } from '../controllers/gestionHorarios.controllers.js';

const router = express.Router();

router.get('/horarios', (req, res) => {
    res.render('Admin/gestionHorarios');
});

router.put('/horarios/:id', actualizarHorarios);

router.get('/api/horarios/:id', obtenerHorarios);

export default router;