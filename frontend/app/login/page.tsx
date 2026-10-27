'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { clienteSupabase } from '../servicios/clienteSupabase';

export default function PaginaLogin() {
  const router = useRouter();
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [verClave, setVerClave] = useState(false);
  const [cargando, setCargando] = useState(false);

  const notificarYNavegar = () => {
    window.dispatchEvent(new Event('sesionActualizada'));
    router.push('/tienda');
  };

  const manejarLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    const { error } = await clienteSupabase.auth.signInWithPassword({ email: correo, password: clave });
    setCargando(false);

    if (error) return alert(`Error: ${error.message}`);
    notificarYNavegar();
  };

  const manejarSaltarLogin = async () => {
    await clienteSupabase.auth.signOut();
    notificarYNavegar();
  };

  return (
    <main className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white tracking-tight">CarShop</h1>
          <p className="text-sm text-slate-400 mt-1">Inicia sesión con tu cuenta</p>
        </div>

        <form onSubmit={manejarLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Correo Electrónico</label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                placeholder="admin@gmail.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Contraseña</label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type={verClave ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-10 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setVerClave(!verClave)}
                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
              >
                {verClave ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition text-sm shadow-lg shadow-indigo-600/20"
          >
            {cargando ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-800 w-full" />
          <span className="bg-slate-900 px-3 text-xs text-slate-500 uppercase absolute">o</span>
        </div>

        <button
          onClick={manejarSaltarLogin}
          type="button"
          className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium py-2 rounded-lg transition text-sm border border-slate-700"
        >
          Continuar como visitante
        </button>
      </div>
    </main>
  );
}