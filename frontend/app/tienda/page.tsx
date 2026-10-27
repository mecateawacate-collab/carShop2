'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ShoppingCart, Info, X } from 'lucide-react';
import { obtenerSesion } from '../servicios/servicioSesion';

interface Auto {
  id: number;
  marca: string;
  modelo: string;
  anio: number;
  precio: number;
  descripcion: string;
  imagenUrl: string;
}

const IMAGEN_DEFECTO = 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80';

export default function PaginaTienda() {
  const router = useRouter();
  const [autos, setAutos] = useState<Auto[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [autoModal, setAutoModal] = useState<Auto | null>(null);

  const consultarAutos = async (termino = '') => {
    try {
      const param = termino ? `?buscar=${encodeURIComponent(termino)}` : '';
      const res = await fetch(`http://localhost:8080/api/autos${param}`);
      const datos = await res.json();
      setAutos(Array.isArray(datos) ? datos : []);
    } catch (e) {
      console.error('Error al cargar autos:', e);
    }
  };

  useEffect(() => {
    consultarAutos();
  }, []);

  const agregarAlCarrito = async (auto: Auto) => {
    const sesion = await obtenerSesion();
    if (sesion.esVisitante) {
      alert('Debes iniciar sesión para agregar productos al carrito.');
      return router.push('/login');
    }

    const carrito: Auto[] = JSON.parse(localStorage.getItem('carritoCarShop') || '[]');
    carrito.push(auto);
    localStorage.setItem('carritoCarShop', JSON.stringify(carrito));
    window.dispatchEvent(new Event('carritoActualizado'));
    alert(`${auto.marca} ${auto.modelo} agregado al carrito 🛒`);
  };

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <h1 className="text-2xl font-black text-white">Catálogo de Autos</h1>
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Buscar por marca o modelo..."
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              consultarAutos(e.target.value);
            }}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {autos.map((auto) => (
          <div
            key={auto.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between group hover:border-slate-700 transition"
          >
            <div className="h-48 overflow-hidden bg-slate-950">
              <img
                src={auto.imagenUrl || IMAGEN_DEFECTO}
                alt={`${auto.marca} ${auto.modelo}`}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
            </div>

            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-white">{auto.marca} {auto.modelo}</h3>
                  <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded">{auto.anio}</span>
                </div>
                <p className="text-emerald-400 font-extrabold text-xl mt-2">${auto.precio.toLocaleString()}</p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setAutoModal(auto)}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 py-2 rounded-lg text-xs font-semibold transition"
                >
                  <Info className="w-4 h-4" />
                  <span>Detalles</span>
                </button>
                <button
                  onClick={() => agregarAlCarrito(auto)}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg text-xs font-semibold transition"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Comprar</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {autoModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl">
            <div className="relative h-56 bg-slate-950">
              <img
                src={autoModal.imagenUrl || IMAGEN_DEFECTO}
                alt={autoModal.modelo}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setAutoModal(null)}
                className="absolute top-3 right-3 bg-slate-900/80 p-1.5 rounded-full text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-baseline">
                <h2 className="text-2xl font-bold text-white">{autoModal.marca} {autoModal.modelo}</h2>
                <span className="text-emerald-400 font-bold text-xl">${autoModal.precio.toLocaleString()}</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">{autoModal.descripcion}</p>
              <div className="text-xs text-slate-500 border-t border-slate-800 pt-3">
                Año de fabricación: <strong className="text-slate-300">{autoModal.anio}</strong>
              </div>
              <button
                onClick={() => {
                  agregarAlCarrito(autoModal);
                  setAutoModal(null);
                }}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-lg font-medium text-sm transition"
              >
                Agregar al carrito
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}