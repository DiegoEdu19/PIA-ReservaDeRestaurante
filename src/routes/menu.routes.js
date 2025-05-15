import express from 'express';

const router = express.Router();

router.get('/menu', (req, res) => {
    res.render('users/menu');
    console.log("obteniendo menú");
});

export default router;