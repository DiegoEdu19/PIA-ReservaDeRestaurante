const express = require('express');
const { getUsuarios } = require('../controllers/gestionUsuarios.controllers');

const router = express.Router();

router.get('/usuarios', (req, res) => {
    res.render('Admin/gestionUsuarios');
});

router.get('/api/usuarios', getUsuarios);

module.exports = router;