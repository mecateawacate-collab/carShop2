import BarraNavegacion from './barraNavegacion';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-slate-950 text-slate-100 min-h-screen">
        <BarraNavegacion />
        {children}
      </body>
    </html>
  );
}