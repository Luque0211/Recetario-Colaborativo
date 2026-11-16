import { Router } from 'express';
import { register, login, logout, getPerfil } from '../controllers/auth.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/perfil', verificarToken, getPerfil); // Ruta protegida

export default router;