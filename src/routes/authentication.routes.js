import express from 'express';
import { methods as authentication} from "../controllers/authentication.controller.js";

const router = express.Router();
router.use(express.json());

router.post("/login", authentication.login);

export default router;