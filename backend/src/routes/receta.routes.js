import { Router } from 'express';
import {
  getRecetas,
  getRecetaById,
  crearReceta,
  actualizarReceta,
  eliminarReceta,
  toggleFavorito,
  getMisFavoritos,
  getCategorias,
  crearCategoria
} from '../controllers/receta.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';

const router = Router();

// Rutas de categorías
router.get('/categorias', getCategorias);
router.post('/categorias', verificarToken, crearCategoria);

// Rutas de favoritos
router.get('/favoritos/mios', verificarToken, getMisFavoritos);
router.post('/:id/favorito', verificarToken, toggleFavorito);

// Rutas CRUD de recetas
router.get('/', getRecetas);
router.get('/:id', getRecetaById);
router.post('/', verificarToken, crearReceta);
router.put('/:id', verificarToken, actualizarReceta);
router.delete('/:id', verificarToken, eliminarReceta);

export default router;