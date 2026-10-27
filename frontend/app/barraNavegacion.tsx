'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Car, Shield, LogOut, LogIn } from 'lucide-react';
import { useEffect, useState } from 'react';
import { obtenerSesion, cerrarSesion, DatosSesion } from './servicios/servicioSesion';

export default function BarraNavegacion() {
  const router = useRouter();
  const [sesion, setSesion] = useState<DatosSesion>({ correo: '', esAdmin: false, esVisitante: true });
  const [totalCarrito, setTotalCarrito] = useState(0);

  useEffect(() => {
    const actualizar = async () => {
      setSesion(await obtenerSesion());
      const carrito = JSON.parse(localStorage.getItem('carritoCarShop') || '[]');
      setTotalCarrito(carrito.length);
    };

    actualizar();
    ['storage', 'sesionActualizada', 'carritoActualizado'].forEach((ev) =>
      window.addEventListener(ev, actualizar)
    );

    return () => {
      ['storage', 'sesionActualizada', 'carritoActualizado'].forEach((ev) =>
        window.removeEventListener(ev, actualizar)
      );
    };
  }, []);

  const salir = async () => {
    await cerrarSesion();
    router.push('/login');
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 px-6 py-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/tienda" className="flex items-center gap-2 text-xl font-black text-indigo-400">
          <Car className="w-6 h-6" />
          <span>CarShop</span>
        </Link>

        <div className="flex items-center gap-5 text-sm font-medium">
          <Link href="/tienda" className="text-slate-300 hover:text-white transition">
            Tienda
          </Link>

          {sesion.esAdmin && (
            <Link href="/adminPanel" className="flex items-center gap-1 text-amber-400 hover:text-amber-300 transition">
              <Shield className="w-4 h-4" />
              <span>Admin Panel</span>
            </Link>
          )}

          <Link
            href="/carritoCompras"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-1.5 rounded-lg transition"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Carrito</span>
            {totalCarrito > 0 && (
              <span className="bg-indigo-900 text-indigo-200 text-xs px-2 py-0.5 rounded-full font-bold">
                {totalCarrito}
              </span>
            )}
          </Link>

          {!sesion.esVisitante ? (
            <button onClick={salir} className="flex items-center gap-1 text-slate-400 hover:text-rose-400 transition">
              <LogOut className="w-4 h-4" />
              <span>Salir</span>
            </button>
          ) : (
            <Link href="/login" className="flex items-center gap-1 text-slate-400 hover:text-indigo-400 transition">
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}