import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Utensils, LogOut, PlusCircle, Home } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-orange-100 shadow-sm px-6 py-4 flex justify-between items-center transition-all">
      <Link to="/" className="flex items-center gap-2.5 text-xl font-extrabold text-orange-600 group">
        <div className="bg-orange-600 text-white p-2 rounded-xl shadow-md group-hover:scale-105 transition-transform">
          <Utensils className="w-5 h-5" />
        </div>
        <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
          Recetario
        </span>
      </Link>

      <div className="flex items-center gap-3">
        <Link 
          to="/" 
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-gray-600 hover:text-orange-600 hover:bg-orange-50 font-medium transition"
        >
          <Home className="w-4 h-4" />
          <span className="hidden sm:inline">Inicio</span>
        </Link>

        {user ? (
          <>
            <Link 
              to="/crear" 
              className="flex items-center gap-1.5 bg-gradient-to-r from-orange-600 to-amber-600 text-white px-4 py-2 rounded-xl shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all font-medium text-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Nueva Receta</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-2 pl-3 border-l border-gray-200">
              <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xs uppercase">
                {user.nombre[0]}
              </span>
              <span className="text-gray-700 font-semibold text-sm">{user.nombre}</span>
            </div>

            <button
              onClick={handleLogout}
              title="Cerrar sesión"
              className="flex items-center gap-1 text-gray-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-xl transition"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Link 
              to="/login" 
              className="text-gray-600 hover:text-orange-600 font-medium px-4 py-2 rounded-xl hover:bg-orange-50/50 transition text-sm"
            >
              Iniciar Sesión
            </Link>
            <Link 
              to="/register" 
              className="bg-orange-600 text-white px-4 py-2 rounded-xl font-medium shadow-md shadow-orange-500/20 hover:bg-orange-700 transition text-sm"
            >
              Registrarse
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}