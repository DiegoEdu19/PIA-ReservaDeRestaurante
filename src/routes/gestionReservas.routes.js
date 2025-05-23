import express from 'express';
import { obtenerReservas } from '../controllers/gestionReservas.controllers.js';

const router = express.Router();

router.get('/gestionReservas', (req, res) => {
    res.render('Admin/gestionReservas');
});

router.get('/reporteReservas', (req, res) => {
    res.render('Admin/reporteReservas');
});

router.get('/reserva', (req, res) => {
    res.render('users/reserva');
});

router.get('/listar', obtenerReservas);

export default router;