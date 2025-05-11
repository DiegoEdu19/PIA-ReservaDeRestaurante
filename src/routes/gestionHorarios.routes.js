const express = require('express');

const router = express.Router();

router.get('/horarios', (req, res) => {
    res.render('Admin/gestionHorarios');
});

module.exports = router;