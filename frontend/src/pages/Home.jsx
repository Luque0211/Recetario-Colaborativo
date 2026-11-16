import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Search, ChefHat, Sparkles, Heart } from 'lucide-react';

export default function Home() {
  const [recetas, setRecetas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [buscar, setBuscar] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategorias();
    fetchRecetas();
  }, []);

  const fetchCategorias = async () => {
    try {
      const { data } = await api.get('/recetas/categorias');
      setCategorias(data);
    } catch (error) {
      console.error('Error al cargar categorías', error);
    }
  };

  const fetchRecetas = async (query = '', catId = '') => {
    try {
      setLoading(true);
      let url = '/recetas?';
      if (query) url += `buscar=${query}&`;
      if (catId) url += `categoriaId=${catId}`;
      const { data } = await api.get(url);
      setRecetas(data);
    } catch (error) {
      console.error('Error al cargar recetas', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRecetas(buscar, categoriaId);
  };

  const handleCategoriaChange = (id) => {
    setCategoriaId(id);
    fetchRecetas(buscar, id);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner Moderno */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 p-8 md:p-12 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Comunidad Culinaria
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight">Comparte y descubre sabores únicos</h1>
          <p className="text-orange-100 text-sm md:text-base leading-relaxed">
            Explora recetas caseras creadas por apasionados de la cocina, guarda tus platos favoritos y publica tus propias creaciones.
          </p>
        </div>
        <div className="absolute right-[-20px] bottom-[-40px] opacity-10 pointer-events-none">
          <ChefHat className="w-96 h-96" />
        </div>
      </div>

      {/* Buscador y Filtros interactivos */}
      <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-orange-100 space-y-5">
        <form onSubmit={handleSearch} className="flex gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar recetas por título..."
              value={buscar}
              onChange={(e) => setBuscar(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all text-sm"
            />
          </div>
          <button
            type="submit"
            className="bg-orange-600 text-white px-7 py-3 rounded-xl font-medium hover:bg-orange-700 active:scale-95 transition-all shadow-md shadow-orange-500/20 text-sm"
          >
            Buscar
          </button>
        </form>

        {/* Categorías (Píldoras con scroll horizontal suave) */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => handleCategoriaChange('')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              categoriaId === '' 
                ? 'bg-orange-600 text-white shadow-md shadow-orange-500/20 scale-105' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            🌟 Todas
          </button>
          {categorias.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoriaChange(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                categoriaId === cat.id 
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-500/20 scale-105' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.nombre}
            </button>
          ))}
        </div>
      </div>

      {/* Listado de Recetas */}
      {loading ? (
        <div className="text-center py-20 text-gray-400 font-medium animate-pulse">Cargando recetas irresistibles...</div>
      ) : recetas.length === 0 ? (
        <div className="text-center py-16 text-gray-500 bg-white rounded-2xl shadow-sm border border-gray-100 space-y-2">
          <ChefHat className="w-12 h-12 mx-auto text-gray-300" />
          <p className="font-semibold text-gray-700">No se encontraron recetas</p>
          <p className="text-xs text-gray-400">Prueba buscando con otros términos o categorías.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recetas.map((receta) => (
            <div 
              key={receta.id} 
              onClick={() => navigate(`/receta/${receta.id}`)}
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between border border-gray-100 cursor-pointer group transform hover:-translate-y-1.5"
            >
              {/* Header de la tarjeta */}
              <div className="h-44 bg-gradient-to-br from-orange-500 to-amber-600 p-6 flex flex-col justify-between text-white relative overflow-hidden">
                <div className="absolute right-[-20px] bottom-[-20px] opacity-15 group-hover:scale-110 transition-transform duration-500">
                  <ChefHat className="w-36 h-36" />
                </div>
                <span className="bg-white/20 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full w-fit tracking-wide uppercase">
                  {receta.categoria?.nombre}
                </span>
                <h3 className="text-xl font-bold line-clamp-1 group-hover:text-orange-100 transition-colors">
                  {receta.titulo}
                </h3>
              </div>

              {/* Cuerpo de la tarjeta */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">{receta.descripcion}</p>

                <div className="space-y-2">
                  <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Ingredientes principales:</h4>
                  <ul className="text-xs text-gray-600 space-y-1.5">
                    {receta.ingredientes?.slice(0, 3).map((item, idx) => (
                      <li key={idx} className="flex justify-between items-center bg-gray-50 px-2.5 py-1.5 rounded-lg">
                        <span className="font-medium text-gray-700">• {item.ingrediente?.nombre}</span>
                        <span className="text-orange-600 font-semibold">{item.cantidad || 'Al gusto'}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer de la tarjeta */}
                <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-xs">
                  <span className="flex items-center gap-1.5 font-semibold text-gray-700">
                    <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-[10px] uppercase">
                      {receta.usuario?.nombre[0]}
                    </div> 
                    {receta.usuario?.nombre}
                  </span>
                  <span className="flex items-center gap-1 bg-red-50 text-red-600 px-3 py-1.5 rounded-xl font-bold shadow-sm">
                    <Heart className="w-3.5 h-3.5 fill-current" /> {receta._count?.favoritos || 0}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}