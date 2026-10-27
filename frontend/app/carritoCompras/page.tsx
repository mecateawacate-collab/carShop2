'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, ArrowRight } from 'lucide-react';
import { useProteccionRuta } from '../hooks/useProteccionRuta';

interface Auto {
  id: number;
  marca: string;
  modelo: string;
  anio: number;
  precio: number;
  imagenUrl: string;
}

const IMAGEN_DEFECTO = 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80';

export default function PaginaCarrito() {
  const router = useRouter();
  const autorizado = useProteccionRuta('autenticado');
  const [items, setItems] = useState<Auto[]>([]);

  useEffect(() => {
    if (autorizado) {
      setItems(JSON.parse(localStorage.getItem('carritoCarShop') || '[]'));
    }
  }, [autorizado]);

  const quitarItem = (indice: number) => {
    const nuevaLista = items.filter((_, i) => i !== indice);
    setItems(nuevaLista);
    localStorage.setItem('carritoCarShop', JSON.stringify(nuevaLista));
    window.dispatchEvent(new Event('carritoActualizado'));
  };

  const total = items.reduce((acc, auto) => acc + auto.precio, 0);

  if (!autorizado) return null;

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-black text-white">Tu Carrito de Compras</h1>

      {items.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
          <p className="text-slate-400">El carrito está vacío actualmente.</p>
          <button
            onClick={() => router.push('/tienda')}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition"
          >
            Explorar Tienda
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            {items.map((auto, i) => (
              <div
                key={`${auto.id}-${i}`}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between gap-4"
              >
                <img
                  src={auto.imagenUrl || IMAGEN_DEFECTO}
                  alt={auto.modelo}
                  className="w-20 h-16 object-cover rounded-lg bg-slate-950"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-white text-base">{auto.marca} {auto.modelo}</h3>
                  <p className="text-xs text-slate-400">Año {auto.anio}</p>
                </div>
                <div className="text-right flex items-center gap-4">
                  <p className="text-emerald-400 font-bold">${auto.precio.toLocaleString()}</p>
                  <button
                    onClick={() => quitarItem(i)}
                    className="text-rose-400 hover:text-rose-300 p-1.5 rounded hover:bg-rose-950/40 transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-fit space-y-5">
            <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Resumen de Compra</h2>
            <div className="flex justify-between text-sm text-slate-300">
              <span>Total de vehículos:</span>
              <span className="font-bold">{items.length}</span>
            </div>
            <div className="flex justify-between text-lg font-extrabold text-white border-t border-slate-800 pt-3">
              <span>Total:</span>
              <span className="text-emerald-400">${total.toLocaleString()}</span>
            </div>
            <button
              onClick={() => router.push('/pagarProductos')}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg font-semibold text-sm transition"
            >
              <span>Continuar al Pago</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </main>
  );
}