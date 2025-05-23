import express from 'express';
import { actualizarCapacidad } from '../controllers/gestionDisponibilidad.controllers.js';

const router = express.Router();

router.get('/disponibilidad', (req, res) => {
    res.render('Admin/gestionDisponibilidad');
});

router.post('/capacidad', actualizarCapacidad);

export default router;