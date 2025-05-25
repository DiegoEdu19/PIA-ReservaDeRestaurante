import express from 'express';
import { obtenerReservas, crearReservas, traerEstados, eliminarReserva, editarReserva, traerPorId } from '../controllers/gestionReservas.controllers.js';
import {crearReserva} from "../controllers/creacionReservas.controller.js";

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

router.post('/reservas', crearReservas);

router.get('/estados', traerEstados);

router.delete('/reservasE/:id', eliminarReserva);

router.get('/reservas/:id', traerPorId);

router.put('/reservas/:id', editarReserva);

//usuario crear reserva
router.post('/crearReserva', crearReserva);

export default router;