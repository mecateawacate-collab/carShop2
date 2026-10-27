'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Edit2, Trash2, X, Store } from 'lucide-react';
import { useProteccionRuta } from '../hooks/useProteccionRuta';

interface Auto {
  id: number;
  marca: string;
  modelo: string;
  anio: number;
  precio: number;
  descripcion: string;
  imagenUrl: string;
}

const IMAGEN_DEFECTO = 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800';

const FORM_INICIAL = {
  marca: '',
  modelo: '',
  anio: '',
  precio: '',
  descripcion: '',
  imagenUrl: '',
};

export default function PaginaAdmin() {
  const autorizado = useProteccionRuta('admin');
  const [autos, setAutos] = useState<Auto[]>([]);
  const [idEditando, setIdEditando] = useState<number | null>(null);
  const [form, setForm] = useState(FORM_INICIAL);

  const cargarAutos = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/autos');
      const datos = await res.json();
      setAutos(Array.isArray(datos) ? datos : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (autorizado) cargarAutos();
  }, [autorizado]);

  const limpiar = () => {
    setIdEditando(null);
    setForm(FORM_INICIAL);
  };

  const seleccionar = (auto: Auto) => {
    setIdEditando(auto.id);
    setForm({
      marca: auto.marca,
      modelo: auto.modelo,
      anio: auto.anio.toString(),
      precio: auto.precio.toString(),
      descripcion: auto.descripcion,
      imagenUrl: auto.imagenUrl,
    });
  };

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      anio: parseInt(form.anio) || 0,
      precio: parseFloat(form.precio) || 0,
      imagenUrl: form.imagenUrl || IMAGEN_DEFECTO,
    };

    const metodo = idEditando ? 'PUT' : 'POST';
    const url = idEditando
      ? `http://localhost:8080/api/autos/${idEditando}`
      : 'http://localhost:8080/api/autos';

    await fetch(url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    limpiar();
    cargarAutos();
  };

  const eliminar = async (id: number) => {
    if (confirm('¿Seguro que deseas eliminar este vehículo de la tienda?')) {
      await fetch(`http://localhost:8080/api/autos/${id}`, { method: 'DELETE' });
      cargarAutos();
    }
  };

  if (!autorizado) return null;

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <h1 className="text-2xl font-bold text-white">Panel de Administración</h1>
          <p className="text-xs text-slate-400">Acceso restringido únicamente a administradores</p>
        </div>

        <Link
          href="/tienda"
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs font-semibold transition"
        >
          <Store className="w-4 h-4" />
          <span>Ver Tienda</span>
        </Link>
      </div>

      <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <h2 className="text-lg font-bold text-white mb-4">
          {idEditando ? 'Editar Auto' : 'Agregar Nuevo Auto'}
        </h2>
        <form onSubmit={guardar} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <input
            type="text"
            required
            placeholder="Marca"
            value={form.marca}
            onChange={(e) => setForm({ ...form, marca: e.target.value })}
            className="bg-slate-950 border border-slate-700 p-2.5 rounded-lg text-white text-sm"
          />
          <input
            type="text"
            required
            placeholder="Modelo"
            value={form.modelo}
            onChange={(e) => setForm({ ...form, modelo: e.target.value })}
            className="bg-slate-950 border border-slate-700 p-2.5 rounded-lg text-white text-sm"
          />
          <input
            type="number"
            required
            placeholder="Año"
            value={form.anio}
            onChange={(e) => setForm({ ...form, anio: e.target.value })}
            className="bg-slate-950 border border-slate-700 p-2.5 rounded-lg text-white text-sm"
          />
          <input
            type="number"
            required
            placeholder="Precio"
            value={form.precio}
            onChange={(e) => setForm({ ...form, precio: e.target.value })}
            className="bg-slate-950 border border-slate-700 p-2.5 rounded-lg text-white text-sm"
          />
          <input
            type="text"
            placeholder="URL de imagen Unsplash"
            value={form.imagenUrl}
            onChange={(e) => setForm({ ...form, imagenUrl: e.target.value })}
            className="sm:col-span-4 bg-slate-950 border border-slate-700 p-2.5 rounded-lg text-white text-sm"
          />
          <textarea
            required
            placeholder="Descripción del vehículo..."
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            className="sm:col-span-4 bg-slate-950 border border-slate-700 p-2.5 rounded-lg text-white text-sm h-20"
          />

          <div className="sm:col-span-4 flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg transition text-sm"
            >
              {idEditando ? 'Actualizar Auto' : 'Guardar Auto'}
            </button>

            {idEditando && (
              <button
                type="button"
                onClick={limpiar}
                className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2.5 rounded-lg text-sm font-medium transition"
              >
                <X className="w-4 h-4" />
                <span>Cancelar</span>
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950 text-slate-400 text-xs uppercase border-b border-slate-800">
              <tr>
                <th className="p-4">Auto</th>
                <th className="p-4">Año</th>
                <th className="p-4">Precio</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {autos.map((auto) => (
                <tr key={auto.id} className="hover:bg-slate-800/40">
                  <td className="p-4 font-bold text-white flex items-center gap-3">
                    <img
                      src={auto.imagenUrl || IMAGEN_DEFECTO}
                      alt={auto.modelo}
                      className="w-10 h-8 rounded object-cover bg-slate-950"
                    />
                    <span>{auto.marca} {auto.modelo}</span>
                  </td>
                  <td className="p-4">{auto.anio}</td>
                  <td className="p-4 text-emerald-400 font-semibold">${auto.precio.toLocaleString()}</td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => seleccionar(auto)}
                      className="p-1.5 text-indigo-400 hover:bg-slate-800 rounded"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => eliminar(auto.id)}
                      className="p-1.5 text-rose-400 hover:bg-slate-800 rounded"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}