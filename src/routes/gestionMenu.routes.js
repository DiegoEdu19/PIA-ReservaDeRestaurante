import express from 'express';
import { uploadMenuHandler } from "../controllers/gestionMenu.controllers.js";
const router = express.Router();
router.use(express.json());

router.get('/menuAdmin', (req, res) => {
    res.render('Admin/menuAdmin');
});

router.post("/menuAdmin", uploadMenuHandler);

export default router;