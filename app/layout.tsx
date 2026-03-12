// app/layout.tsx
import './globals.css'; //Tailwind 

export const metadata = {
  title: 'Panel Prestador de Servicios',
  description: 'Sistema de administración',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      {/* El <body> envuelve toda la aplicación */}
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}