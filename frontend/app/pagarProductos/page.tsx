'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, XCircle } from 'lucide-react';
import { useProteccionRuta } from '../hooks/useProteccionRuta';

interface Auto {
  id: number;
  marca: string;
  modelo: string;
  precio: number;
}

export default function PaginaPago() {
  const router = useRouter();
  const autorizado = useProteccionRuta('autenticado');
  const [items, setItems] = useState<Auto[]>([]);
  const [completado, setCompletado] = useState(false);

  useEffect(() => {
    if (autorizado) {
      setItems(JSON.parse(localStorage.getItem('carritoCarShop') || '[]'));
    }
  }, [autorizado]);

  const total = items.reduce((acc, auto) => acc + auto.precio, 0);

  const confirmarPago = () => {
    localStorage.removeItem('carritoCarShop');
    window.dispatchEvent(new Event('carritoActualizado'));
    setCompletado(true);
  };

  if (!autorizado) return null;

  if (completado) {
    return (
      <main className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl max-w-md w-full text-center space-y-4 shadow-2xl">
          <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto" />
          <h1 className="text-2xl font-black text-white">¡Pago Exitoso!</h1>
          <p className="text-sm text-slate-400">
            Tu compra ha sido procesada de manera segura. El recibo fue emitido.
          </p>
          <button
            onClick={() => router.push('/tienda')}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-lg text-sm font-semibold transition"
          >
            Volver a la Tienda
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-black text-white">Finalizar Compra</h1>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Productos a pagar</h2>
          <div className="divide-y divide-slate-800">
            {items.map((auto, i) => (
              <div key={i} className="py-2.5 flex justify-between text-sm">
                <span className="text-slate-200">{auto.marca} {auto.modelo}</span>
                <span className="text-emerald-400 font-medium">${auto.precio.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-800 pt-3 flex justify-between text-lg font-bold text-white">
            <span>Total a pagar:</span>
            <span className="text-emerald-400">${total.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            onClick={() => router.push('/carritoCompras')}
            className="flex-1 flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-lg text-sm font-medium transition"
          >
            <XCircle className="w-4 h-4" />
            <span>Cancelar</span>
          </button>

          <button
            onClick={confirmarPago}
            className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-lg text-sm font-bold transition shadow-lg shadow-emerald-600/20"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirmar Pago Seguro</span>
          </button>
        </div>
      </div>
    </main>
  );
}