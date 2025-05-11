import express from 'express';

const router = express.Router();

router.get('/disponibilidad', (req, res) => {
    res.render('Admin/gestionDisponibilidad');
});

export default router;