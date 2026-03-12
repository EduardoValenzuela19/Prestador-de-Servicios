'use client';
import { useState, useEffect } from 'react';

interface Servicio {
  _id: string;
  titulo: string;
  descripcion: string;
  precio: string;
  categoria: string;
  horarios: string[];
}

export default function CalendarioDisponibilidadPage() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargarServicios = async () => {
    try {
      const res = await fetch('/api/inventario');
      if (res.ok) {
        const data = await res.json();
        setServicios(data);
      }
    } catch (error) {
      console.error("Error al cargar:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarServicios();
  }, []);

  const handleEliminar = async (id: string) => {
    if (confirm("¿Eliminar este servicio del calendario y del inventario?")) {
      try {
        const res = await fetch(`/api/inventario/${id}`, { method: 'DELETE' });
        if (res.ok) cargarServicios();
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold border-b border-gray-200 pb-2 mb-2 text-slate-800">
        Calendario de Disponibilidad
      </h1>
      <p className="text-gray-500 text-sm mb-8">Servicios y horarios habilitados</p>

      {cargando ? <p>Cargando disponibilidad...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {servicios.map((servicio) => (
            <div key={servicio._id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm relative group">
              {/* Eliminar bonotn */}
              <button 
                onClick={() => handleEliminar(servicio._id)}
                className="absolute top-3 right-3 text-red-500 hover:bg-red-50 p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                title="Eliminar Servicio"
              >
                🗑️
              </button>

              <h3 className="m-0 mb-1 text-[#da3743] font-bold text-lg pr-6">{servicio.titulo}</h3>
              <p className="m-0 mb-4 text-sm text-gray-500 flex flex-col gap-1">
                <span className="bg-gray-100 px-2.5 py-1 rounded-full text-xs font-bold text-slate-700 w-fit">
                  {servicio.categoria || 'Servicio'}
                </span>
                <span>{servicio.descripcion}</span>
                <span className="font-bold text-slate-700">{servicio.precio}</span>
              </p>

              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                {servicio.horarios.length > 0 ? (
                  servicio.horarios.map((hora, index) => (
                    <span key={index} className="bg-[#da3743] text-white px-3 py-1 rounded-md text-xs font-bold shadow-sm">{hora}</span>
                  ))
                ) : <span className="text-xs text-gray-400 italic">Sin horarios</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}