import express from 'express';

const router = express.Router();

router.get('/menu', (req, res) => {
    res.render('users/menu');
    console.log("obteniendo menú");
});

router.patch('/menu', (req, res) => {

    console.log("Menú editado");

});

router.get('/menuAdmin', (req, res) => {
    res.render('Admin/menuAdmin');
    console.log("obteniendo menú");
});

export default router;