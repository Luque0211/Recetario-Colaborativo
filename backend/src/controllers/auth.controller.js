import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';

// 1. Registro de usuario
export const register = async (req, res) => {
  try {
    const { email, password, nombre } = req.body;

    // Verificar si el correo ya existe
    const usuarioExistente = await prisma.usuario.findUnique({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado.' });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario en BD
    const nuevoUsuario = await prisma.usuario.create({
      data: {
        email,
        password: hashedPassword,
        nombre
      },
      select: { id: true, email: true, nombre: true, createdAt: true } // No devolver el password
    });

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      usuario: nuevoUsuario
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno al registrar el usuario.' });
  }
};

// 2. Inicio de sesión
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    // Verificar contraseña
    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    // Firmar token JWT
    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    // Enviar token en cookie httpOnly y también en el cuerpo JSON
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
    });

    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno al iniciar sesión.' });
  }
};

// 3. Cerrar sesión
export const logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Sesión cerrada correctamente' });
};

// 4. Obtener perfil del usuario autenticado
export const getPerfil = async (req, res) => {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: req.userId },
      select: { id: true, email: true, nombre: true, createdAt: true }
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el perfil.' });
  }
};