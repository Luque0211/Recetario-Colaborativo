import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CrearReceta from './pages/CrearReceta';
import DetalleReceta from './pages/DetalleReceta';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/crear" element={<CrearReceta />} />
              <Route path="/receta/:id" element={<DetalleReceta />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}