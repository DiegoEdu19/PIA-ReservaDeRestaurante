const express = require('express');

const router = express.Router();

router.get('/disponibilidad', (req, res) => {
    res.render('Admin/gestionDisponibilidad');
});

module.exports = router;