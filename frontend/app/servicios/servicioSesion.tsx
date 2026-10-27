import { clienteSupabase } from './clienteSupabase';

export interface DatosSesion {
  correo: string;
  esAdmin: boolean;
  esVisitante: boolean;
}

export const obtenerSesion = async (): Promise<DatosSesion> => {
  const { data: { session } } = await clienteSupabase.auth.getSession();

  if (!session?.user?.email) {
    return { correo: '', esAdmin: false, esVisitante: true };
  }

  const correo = session.user.email;

  try {
    const res = await fetch(`http://localhost:8080/api/verificar-rol?email=${encodeURIComponent(correo)}`);
    const datos = await res.json();
    return { correo, esAdmin: Boolean(datos.esAdmin), esVisitante: false };
  } catch {
    return { correo, esAdmin: false, esVisitante: false };
  }
};

export const cerrarSesion = async (): Promise<void> => {
  await clienteSupabase.auth.signOut();
  localStorage.removeItem('carritoCarShop');
  window.dispatchEvent(new Event('sesionActualizada'));
  window.dispatchEvent(new Event('carritoActualizado'));
};