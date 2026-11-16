import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { ChefHat, ArrowLeft, Trash2, Clock, CheckCircle2 } from 'lucide-react';

export default function DetalleReceta() {
  const { id } = useParams();
  const [receta, setReceta] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchReceta();
  }, [id]);

  const fetchReceta = async () => {
    try {
      const { data } = await api.get(`/recetas/${id}`);
      setReceta(data);
    } catch (error) {
      console.error('Error al cargar la receta', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async () => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta receta?')) return;
    try {
      await api.delete(`/recetas/${id}`);
      navigate('/');
    } catch (error) {
      alert('No tienes permiso para eliminar esta receta.');
    }
  };

  if (loading) return <div className="text-center py-24 text-gray-400 font-medium animate-pulse">Cargando detalles...</div>;
  if (!receta) return <div className="text-center py-24 text-gray-500 font-medium">Receta no encontrada.</div>;

  const esPropietario = user && user.id === receta.usuarioId;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      <button 
        onClick={() => navigate('/')} 
        className="inline-flex items-center gap-2 text-gray-500 hover:text-orange-600 font-semibold text-sm bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 transition-all hover:scale-[1.02]"
      >
        <ArrowLeft className="w-4 h-4" /> Volver al inicio
      </button>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 p-8 md:p-10 text-white relative overflow-hidden">
          <div className="absolute right-[-20px] bottom-[-30px] opacity-10 pointer-events-none">
            <ChefHat className="w-64 h-64" />
          </div>
          <div className="relative z-10 space-y-4">
            <div className="flex justify-between items-center">
              <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                {receta.categoria?.nombre}
              </span>
              {esPropietario && (
                <button 
                  onClick={handleEliminar}
                  className="bg-red-500/80 hover:bg-red-600 text-white px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold shadow-md backdrop-blur-md"
                >
                  <Trash2 className="w-4 h-4" /> Eliminar Receta
                </button>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">{receta.titulo}</h1>
            <p className="text-orange-100 text-sm md:text-base leading-relaxed max-w-2xl">{receta.descripcion}</p>
            <div className="flex items-center gap-2 pt-2 text-sm text-orange-100 font-medium">
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs uppercase text-white">
                {receta.usuario?.nombre[0]}
              </div>
              Receta compartida por <span className="text-white font-bold">{receta.usuario?.nombre}</span>
            </div>
          </div>
        </div>

        {/* Contenido Grid */}
        <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Columna Izquierda: Ingredientes */}
          <div className="md:col-span-1 bg-orange-50/50 p-6 rounded-2xl border border-orange-100/60 space-y-4 h-fit">
            <h3 className="font-extrabold text-gray-800 text-base border-b border-orange-200/60 pb-3 flex items-center gap-2">
              🛒 Ingredientes
            </h3>
            <ul className="space-y-2.5 text-sm">
              {receta.ingredientes?.map((item, idx) => (
                <li key={idx} className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-orange-100/40">
                  <span className="font-medium text-gray-700">{item.ingrediente?.nombre}</span>
                  <span className="text-orange-600 font-bold text-xs bg-orange-50 px-2.5 py-1 rounded-lg">
                    {item.cantidad || 'Al gusto'}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna Derecha: Instrucciones */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="font-extrabold text-gray-800 text-base border-b border-gray-100 pb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-orange-600" /> Instrucciones de Preparación
            </h3>
            <div className="text-gray-600 whitespace-pre-line leading-relaxed bg-gray-50/50 p-6 rounded-2xl border border-gray-100 text-sm md:text-base">
              {receta.instrucciones}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}