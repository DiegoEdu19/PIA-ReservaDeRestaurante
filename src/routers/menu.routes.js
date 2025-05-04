const express = require('express');

const router = express.Router();

router.get('/menu', (req, res) => {
    res.render('users/menu');
    console.log("obteniendo menú");
});

router.patch('/menu', (req, res) => {

    console.log("Menú editado");

});

module.exports = router;