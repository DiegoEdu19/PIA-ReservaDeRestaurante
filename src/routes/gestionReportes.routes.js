import express from 'express';
import { getReporteReservas } from '../controllers/gestionReportes.controller.js'; // Asegúrate de que la ruta sea correcta

const router = express.Router();

// Ruta para renderizar la vista
router.get('/reporteReservas', (req, res) => {
    res.render('Admin/reporteReservas');
});

// Ruta API para obtener datos del gráfico
router.get('/api/reporteReservas', getReporteReservas); // 👈 Aquí se conecta tu controlador

export default router;