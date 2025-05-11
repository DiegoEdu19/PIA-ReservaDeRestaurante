const express = require('express');

const router = express.Router();

router.get('/gestionReservas', (req, res) => {
    res.render('Admin/gestionReservas');
});

router.get('/reporteReservas', (req, res) => {
    res.render('Admin/reporteReservas');
});


module.exports = router;