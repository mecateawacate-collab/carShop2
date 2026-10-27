'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { obtenerSesion } from '../servicios/servicioSesion';

type ReglaAcceso = 'autenticado' | 'admin';

export const useProteccionRuta = (regla: ReglaAcceso = 'autenticado') => {
  const router = useRouter();
  const [autorizado, setAutorizado] = useState(false);

  useEffect(() => {
    let activo = true;

    obtenerSesion().then((sesion) => {
      if (!activo) return;

      if (sesion.esVisitante) {
        alert('Debes iniciar sesión para realizar esta acción.');
        router.replace('/login');
        return;
      }

      if (regla === 'admin' && !sesion.esAdmin) {
        alert('No tienes permisos de administrador para entrar aquí.');
        router.replace('/tienda');
        return;
      }

      setAutorizado(true);
    });

    return () => {
      activo = false;
    };
  }, [regla, router]);

  return autorizado;
};