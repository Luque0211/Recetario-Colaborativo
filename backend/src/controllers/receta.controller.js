import prisma from '../config/prisma.js';

// 1. Obtener todas las recetas (con búsqueda por título y filtro por categoría)
export const getRecetas = async (req, res) => {
  try {
    const { buscar, categoriaId } = req.query;

    const filtros = {};

    if (buscar) {
      filtros.titulo = {
        contains: buscar,
        mode: 'insensitive'
      };
    }

    if (categoriaId) {
      filtros.categoriaId = Number(categoriaId);
    }

    const recetas = await prisma.receta.findMany({
      where: filtros,
      orderBy: { createdAt: 'desc' },
      include: {
        usuario: { select: { id: true, nombre: true } },
        categoria: true,
        ingredientes: {
          include: { ingrediente: true }
        },
        _count: { select: { favoritos: true } }
      }
    });

    res.json(recetas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las recetas.' });
  }
};

// 2. Obtener una receta por ID
export const getRecetaById = async (req, res) => {
  try {
    const { id } = req.params;

    const receta = await prisma.receta.findUnique({
      where: { id: Number(id) },
      include: {
        usuario: { select: { id: true, nombre: true, email: true } },
        categoria: true,
        ingredientes: {
          include: { ingrediente: true }
        },
        _count: { select: { favoritos: true } }
      }
    });

    if (!receta) {
      return res.status(404).json({ error: 'Receta no encontrada.' });
    }

    res.json(receta);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el detalle de la receta.' });
  }
};

// 3. Crear una nueva receta
export const crearReceta = async (req, res) => {
  try {
    const { titulo, descripcion, instrucciones, categoriaId, ingredientes } = req.body;

    const nuevaReceta = await prisma.receta.create({
      data: {
        titulo,
        descripcion,
        instrucciones,
        usuarioId: req.userId,
        categoriaId: Number(categoriaId),
        ingredientes: {
          create: ingredientes?.map((item) => ({
            cantidad: item.cantidad || null,
            ingrediente: {
              connectOrCreate: {
                where: { nombre: item.nombre.trim().toLowerCase() },
                create: { nombre: item.nombre.trim().toLowerCase() }
              }
            }
          })) || []
        }
      },
      include: {
        categoria: true,
        ingredientes: { include: { ingrediente: true } }
      }
    });

    res.status(201).json(nuevaReceta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la receta.' });
  }
};

// 4. Actualizar receta (Solo el creador)
export const actualizarReceta = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, instrucciones, categoriaId, ingredientes } = req.body;

    const recetaExistente = await prisma.receta.findUnique({
      where: { id: Number(id) }
    });

    if (!recetaExistente) {
      return res.status(404).json({ error: 'Receta no encontrada.' });
    }

    if (recetaExistente.usuarioId !== req.userId) {
      return res.status(403).json({ error: 'No tienes permiso para editar esta receta.' });
    }

    const recetaActualizada = await prisma.receta.update({
      where: { id: Number(id) },
      data: {
        titulo,
        descripcion,
        instrucciones,
        categoriaId: Number(categoriaId),
        ...(ingredientes && {
          ingredientes: {
            deleteMany: {},
            create: ingredientes.map((item) => ({
              cantidad: item.cantidad || null,
              ingrediente: {
                connectOrCreate: {
                  where: { nombre: item.nombre.trim().toLowerCase() },
                  create: { nombre: item.nombre.trim().toLowerCase() }
                }
              }
            }))
          }
        })
      },
      include: {
        categoria: true,
        ingredientes: { include: { ingrediente: true } }
      }
    });

    res.json(recetaActualizada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar la receta.' });
  }
};

// 5. Eliminar receta (Solo el creador)
export const eliminarReceta = async (req, res) => {
  try {
    const { id } = req.params;

    const recetaExistente = await prisma.receta.findUnique({
      where: { id: Number(id) }
    });

    if (!recetaExistente) {
      return res.status(404).json({ error: 'Receta no encontrada.' });
    }

    if (recetaExistente.usuarioId !== req.userId) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar esta receta.' });
    }

    await prisma.receta.delete({
      where: { id: Number(id) }
    });

    res.json({ message: 'Receta eliminada correctamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la receta.' });
  }
};

// 6. Alternar Favorito (Agregar / Quitar)
export const toggleFavorito = async (req, res) => {
  try {
    const recetaId = Number(req.params.id);
    const usuarioId = req.userId;

    const favoritoExistente = await prisma.favorito.findUnique({
      where: {
        usuarioId_recetaId: { usuarioId, recetaId }
      }
    });

    if (favoritoExistente) {
      await prisma.favorito.delete({
        where: { usuarioId_recetaId: { usuarioId, recetaId } }
      });
      return res.json({ favorito: false, message: 'Eliminada de favoritos.' });
    }

    await prisma.favorito.create({
      data: { usuarioId, recetaId }
    });

    res.status(201).json({ favorito: true, message: 'Agregada a favoritos.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al procesar favorito.' });
  }
};

// 7. Obtener mis recetas favoritas
export const getMisFavoritos = async (req, res) => {
  try {
    const favoritos = await prisma.favorito.findMany({
      where: { usuarioId: req.userId },
      include: {
        receta: {
          include: {
            usuario: { select: { id: true, nombre: true } },
            categoria: true
          }
        }
      }
    });

    res.json(favoritos.map((f) => f.receta));
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener favoritos.' });
  }
};

// 8. Obtener todas las categorías (y crear categoría)
export const getCategorias = async (req, res) => {
  try {
    const categorias = await prisma.categoria.findMany({
      orderBy: { nombre: 'asc' }
    });
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener categorías.' });
  }
};

export const crearCategoria = async (req, res) => {
  try {
    const { nombre } = req.body;
    const categoria = await prisma.categoria.create({
      data: { nombre: nombre.trim() }
    });
    res.status(201).json(categoria);
  } catch (error) {
    res.status(400).json({ error: 'La categoría ya existe o datos inválidos.' });
  }
};