import express from 'express';

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

export default router;