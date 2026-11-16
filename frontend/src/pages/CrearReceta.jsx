import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Plus, Trash2, Utensils, Sparkles } from 'lucide-react';

export default function CrearReceta() {
  const [categorias, setCategorias] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [instrucciones, setInstrucciones] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [ingredientes, setIngredientes] = useState([{ nombre: '', cantidad: '' }]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      const { data } = await api.get('/recetas/categorias');
      setCategorias(data);
      if (data.length > 0) setCategoriaId(data[0].id);
    } catch (error) {
      console.error('Error al cargar categorías', error);
    }
  };

  const handleIngredienteChange = (index, field, value) => {
    const nuevosIngredientes = [...ingredientes];
    nuevosIngredientes[index][field] = value;
    setIngredientes(nuevosIngredientes);
  };

  const agregarFilaIngrediente = () => {
    setIngredientes([...ingredientes, { nombre: '', cantidad: '' }]);
  };

  const eliminarFilaIngrediente = (index) => {
    if (ingredientes.length === 1) return;
    setIngredientes(ingredientes.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const ingredientesValidos = ingredientes.filter(item => item.nombre.trim() !== '');

    if (ingredientesValidos.length === 0) {
      setError('Debes agregar al menos un ingrediente.');
      return;
    }

    try {
      await api.post('/recetas', {
        titulo,
        descripcion,
        instrucciones,
        categoriaId: Number(categoriaId),
        ingredientes: ingredientesValidos
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear la receta.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 md:p-10 rounded-3xl shadow-xl my-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
        <div className="bg-orange-100 text-orange-600 p-3 rounded-2xl">
          <Utensils className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-800">Publicar Nueva Receta</h2>
          <p className="text-xs text-gray-400">Comparte tu talento culinario con la comunidad</p>
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium border border-red-100">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">Título de la Receta</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            placeholder="Ej. Tarta de Manzana Casera"
            className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all text-sm"
          />
        </div>

        <div>
          <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">Categoría</label>
          <select
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all text-sm"
          >
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">Descripción Breve</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows="2"
            placeholder="Una breve introducción sobre el plato..."
            className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all text-sm resize-none"
          ></textarea>
        </div>

        {/* Sección de Ingredientes Dinámicos */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider">Ingredientes</label>
            <button
              type="button"
              onClick={agregarFilaIngrediente}
              className="text-xs bg-orange-50 text-orange-700 px-3 py-1.5 rounded-xl hover:bg-orange-100 flex items-center gap-1 font-bold transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Agregar Ingrediente
            </button>
          </div>

          <div className="space-y-2.5">
            {ingredientes.map((item, index) => (
              <div key={index} className="flex gap-2.5 items-center">
                <input
                  type="text"
                  placeholder="Ingrediente (ej. Harina)"
                  value={item.nombre}
                  onChange={(e) => handleIngredienteChange(index, 'nombre', e.target.value)}
                  required
                  className="flex-1 px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white text-sm"
                />
                <input
                  type="text"
                  placeholder="Cant. (ej. 500g)"
                  value={item.cantidad}
                  onChange={(e) => handleIngredienteChange(index, 'cantidad', e.target.value)}
                  className="w-36 px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white text-sm"
                />
                {ingredientes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => eliminarFilaIngrediente(index)}
                    className="text-gray-400 hover:text-red-600 p-2.5 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">Instrucciones de Preparación</label>
          <textarea
            value={instrucciones}
            onChange={(e) => setInstrucciones(e.target.value)}
            rows="5"
            required
            placeholder="Paso 1: Mezclar los ingredientes..."
            className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all text-sm"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-orange-600 to-amber-600 text-white py-3.5 rounded-xl font-bold hover:from-orange-700 hover:to-amber-700 active:scale-[0.99] transition-all shadow-lg shadow-orange-500/25 text-sm"
        >
          Publicar Receta
        </button>
      </form>
    </div>
  );
}