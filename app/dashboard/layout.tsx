'use client';
import Link from 'next/link';
import { ReactNode, useState } from 'react';
import { usePathname } from 'next/navigation';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [cargando, setCargando] = useState(false);
 
  const [locationName, setLocationName] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');

  const pathname = usePathname();

  const handleGuardarPerfil = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);

    try {
      const res = await fetch('/api/ubicacion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locationName, city, address }),
      });

      if (res.ok) {
        alert("¡Ubicación guardada con éxito!");
        setMostrarModal(false);
        setLocationName(''); setCity(''); setAddress('');
      } else {
        alert("Ocurrió un error al guardar el perfil.");
      }
    } catch (error) {
      console.error("Error al guardar:", error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="flex h-screen bg-white text-slate-800 font-sans overflow-hidden">
      

      <aside className="w-[250px] bg-gray-50 border-r border-gray-200 flex flex-col py-5">
        <h2 className="text-center text-[#da3743] mb-8 text-xl font-bold">Panel Prestador</h2>
        
        <nav className="flex flex-col">
          <Link 
            href="/dashboard/calendario" 
            className={`px-5 py-3 text-sm font-medium transition-colors border-l-4 ${pathname === '/dashboard/calendario' ? 'bg-white text-[#da3743] border-[#da3743]' : 'text-gray-700 hover:bg-white hover:text-[#da3743] border-transparent hover:border-[#da3743]'}`}
          >
            1. Calendario
          </Link>
          <Link 
            href="/dashboard/inventario" 
            className={`px-5 py-3 text-sm font-medium transition-colors border-l-4 ${pathname === '/dashboard/inventario' ? 'bg-white text-[#da3743] border-[#da3743]' : 'text-gray-700 hover:bg-white hover:text-[#da3743] border-transparent hover:border-[#da3743]'}`}
          >
            2. Inventario
          </Link>
          <Link 
            href="/dashboard/reservaciones" 
            className={`px-5 py-3 text-sm font-medium transition-colors border-l-4 ${pathname === '/dashboard/reservaciones' ? 'bg-white text-[#da3743] border-[#da3743]' : 'text-gray-700 hover:bg-white hover:text-[#da3743] border-transparent hover:border-[#da3743]'}`}
          >
            3. Reservaciones
          </Link>
          <Link 
            href="/dashboard/cupones" 
            className={`px-5 py-3 text-sm font-medium transition-colors border-l-4 ${pathname === '/dashboard/cupones' ? 'bg-white text-[#da3743] border-[#da3743]' : 'text-gray-700 hover:bg-white hover:text-[#da3743] border-transparent hover:border-[#da3743]'}`}
          >
            4. Cupones / Promociones
          </Link>
        </nav>
      </aside>

      {/* Área Orincipal */}
      <div className="flex-1 flex flex-col bg-white">
        
        <header className="flex justify-end items-center px-10 py-4 border-b border-gray-200 bg-white">
          <button 
            onClick={() => setMostrarModal(true)} 
            className="flex items-center gap-2 font-bold text-slate-800 px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <span className="bg-[#da3743] text-white rounded-full w-8 h-8 flex justify-center items-center text-sm">👤</span>
            <span>Mi Perfil</span>
          </button>
        </header>


        <main className="flex-1 p-10 overflow-y-auto">
          {children}
        </main>
        
      </div>


      {mostrarModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 animate-in fade-in">
          <div className="bg-white p-8 rounded-xl w-[400px] border border-gray-200 shadow-xl">
            <h2 className="mt-0 mb-6 text-[#da3743] text-xl font-bold">Mi Perfil y Ubicación</h2>
            
            <form onSubmit={handleGuardarPerfil} className="flex flex-col gap-4">
              <div>
                <label className="block font-bold text-xs mb-1 text-slate-700">Nombre del Negocio:</label>
                <input 
                  type="text" 
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded focus:outline-none focus:border-[#da3743]" 
                  required 
                />
              </div>
              
              <div>
                <label className="block font-bold text-xs mb-1 text-slate-700">Ciudad:</label>
                <input 
                  type="text" 
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded focus:outline-none focus:border-[#da3743]" 
                  required 
                />
              </div>
              
              <div>
                <label className="block font-bold text-xs mb-1 text-slate-700">Dirección Completa:</label>
                <input 
                  type="text" 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded focus:outline-none focus:border-[#da3743]" 
                  required 
                />
              </div>

              <button 
                type="submit" 
                disabled={cargando}
                className="mt-4 p-3 bg-[#da3743] text-white border-none rounded font-bold w-full hover:bg-[#b8222d] transition-colors disabled:bg-gray-400"
              >
                {cargando ? 'Guardando...' : 'Guardar Ubicación'}
              </button>
              
              <button 
                type="button" 
                onClick={() => setMostrarModal(false)} 
                className="mt-1 p-3 bg-transparent text-gray-500 border-none rounded font-bold w-full hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}