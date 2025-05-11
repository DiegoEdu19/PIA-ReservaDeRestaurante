import express from 'express';

const router = express.Router();

router.get('/horarios', (req, res) => {
    res.render('Admin/gestionHorarios');
});

export default router;