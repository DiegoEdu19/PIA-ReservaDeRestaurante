const express = require('express');

const router = express.Router();

router.get('/users', (req, res) => {
    console.log("obteniendo usuarios");
});

router.get('/users:id', (req, res) => {
    console.log("obteniendo usuario con id " + req.params.id);
});

router.put('/users:id', (req, res) => {
    console.log("Creando usuario con id " + req.params.id);
})

router.delete('/users:id', (req, res) => {
    console.log("Borrado usuario con id " + req.params.id);
})

router.patch('/users:id', (req, res) => {
    console.log("Actualiando usuario con id " + req.params.id);
})

module.exports = router;