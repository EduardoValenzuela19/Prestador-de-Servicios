'use client';
import { useState, useEffect } from 'react';

interface Reserva {
  _id: string;
  title: string;
  start: string; 
  cliente: string;
  descripcion: string;
}

export default function ReservacionesPage() {
  const [eventos, setEventos] = useState<Reserva[]>([]);
  const [cargando, setCargando] = useState(true);


  const [nuevoTitle, setNuevoTitle] = useState('');
  const [nuevoCliente, setNuevoCliente] = useState('');
  const [nuevaDescripcion, setNuevaDescripcion] = useState('');
  const [nuevoStart, setNuevoStart] = useState('');

  const [fechaBase, setFechaBase] = useState(new Date());
  const [reservaSeleccionada, setReservaSeleccionada] = useState<Reserva | null>(null);




  const cargarReservaciones = async () => {
    try {
      const res = await fetch('/api/reservaciones');
      if (res.ok) {
        const data = await res.json();

        const datosFormateados = data.map((reserva: any) => ({
          ...reserva,
          start: new Date(reserva.start).toISOString().split('T')[0]
        }));
        setEventos(datosFormateados);
      }
    } catch (error) {
      console.error("Error al cargar citas:", error);
    } finally {
      setCargando(false);
    }
  };


  useEffect(() => {
    cargarReservaciones();
  }, []);


  const handleAgendar = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { 
      title: nuevoTitle, 
      cliente: nuevoCliente, 
      descripcion: nuevaDescripcion, 
      start: nuevoStart 
    };

    try {
      const res = await fetch('/api/reservaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        cargarReservaciones(); 

        setNuevoTitle(''); setNuevoCliente(''); setNuevaDescripcion(''); setNuevoStart('');
      }
    } catch (error) {
      console.error("Error al guardar cita:", error);
    }
  };


  const handleEliminar = async (id: string) => {
    if (confirm("¿Estás seguro de cancelar y eliminar esta reservación?")) {
      try {
        const res = await fetch(`/api/reservaciones/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setReservaSeleccionada(null); 
          cargarReservaciones(); 
        }
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };



  const año = fechaBase.getFullYear();
  const mes = fechaBase.getMonth();
  const diasEnMes = new Date(año, mes + 1, 0).getDate();
  const primerDiaDelMes = new Date(año, mes, 1).getDay();
  const dias = Array.from({ length: diasEnMes }, (_, i) => i + 1);
  const espaciosVacios = Array.from({ length: primerDiaDelMes }, (_, i) => i);
  const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const mesNombre = fechaBase.toLocaleString('es-MX', { month: 'long', year: 'numeric' });

  const irMesAnterior = () => setFechaBase(new Date(año, mes - 1, 1));
  const irMesSiguiente = () => setFechaBase(new Date(año, mes + 1, 1));
  const obtenerFechaString = (dia: number) => `${año}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;


  return (
    <div>
      <h1 className="text-2xl font-bold border-b border-gray-200 pb-2 mb-2 text-slate-800">
        Calendario de Reservaciones
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        Gestiona tus citas conectadas en tiempo real.
      </p>

      {/* Agendar - Registrar */}
      <form onSubmit={handleAgendar} className="mb-6 flex flex-wrap gap-3 items-end bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-bold mb-1 text-slate-700">Servicio Apartado:</label>
          <input type="text" value={nuevoTitle} onChange={e => setNuevoTitle(e.target.value)} placeholder="Ej. Masaje Relajante" className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[#da3743]" required />
        </div>
        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs font-bold mb-1 text-slate-700">Cliente:</label>
          <input type="text" value={nuevoCliente} onChange={e => setNuevoCliente(e.target.value)} placeholder="Ej. Juan Pérez" className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[#da3743]" required />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-bold mb-1 text-slate-700">Detalles:</label>
          <input type="text" value={nuevaDescripcion} onChange={e => setNuevaDescripcion(e.target.value)} placeholder="Ej. Alergias..." className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[#da3743]" />
        </div>
        <div className="w-[150px]">
          <label className="block text-xs font-bold mb-1 text-slate-700">Fecha:</label>
          <input type="date" value={nuevoStart} onChange={e => setNuevoStart(e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[#da3743]" required />
        </div>
        <button type="submit" className="bg-[#da3743] text-white px-5 py-2 rounded font-bold hover:bg-[#b8222d] transition-colors h-[42px]">
          Agendar Cita
        </button>
      </form>

      <div className="flex gap-8 items-start">
        
        {/* Calendario */}
        <div className="flex-[2] bg-white p-6 border border-gray-200 rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <button onClick={irMesAnterior} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-slate-700 font-bold transition">← Anterior</button>
            <h2 className="text-lg font-bold text-[#da3743] capitalize">{mesNombre}</h2>
            <button onClick={irMesSiguiente} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-slate-700 font-bold transition">Siguiente →</button>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-2">
            {diasSemana.map(dia => <div key={dia} className="text-center font-bold text-slate-400 text-sm py-2">{dia}</div>)}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {espaciosVacios.map(i => <div key={`vacio-${i}`} className="bg-gray-50/50 border border-gray-100 min-h-[100px] rounded-lg"></div>)}

            {dias.map(dia => {
              const fechaDelDia = obtenerFechaString(dia);
              const eventosDelDia = eventos.filter(e => e.start === fechaDelDia);

              return (
                <div key={dia} className="bg-white border border-gray-200 min-h-[100px] p-2 rounded-lg hover:border-[#da3743] transition-colors flex flex-col gap-1">
                  <span className={`text-sm font-bold w-6 h-6 flex items-center justify-center rounded-full ${fechaDelDia === new Date().toISOString().split('T')[0] ? 'bg-[#da3743] text-white' : 'text-slate-700'}`}>
                    {dia}
                  </span>
                  
                  <div className="flex flex-col gap-1 overflow-y-auto max-h-[65px] no-scrollbar">
                    {cargando ? null : eventosDelDia.map(evento => (
                      <div 
                        key={evento._id}
                        onClick={() => setReservaSeleccionada(evento)}
                        className="bg-red-50 text-[#da3743] text-[10px] leading-tight p-1.5 rounded border border-red-100 truncate font-semibold cursor-pointer hover:bg-red-100 transition"
                      >
                        {evento.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Edicion de la Reserva */}
        <div className="flex-[1] border border-gray-200 p-6 rounded-xl bg-gray-50 sticky top-5">
          <h3 className="mt-0 text-lg font-bold mb-4 text-[#da3743] border-b border-gray-200 pb-2">
            Detalles de la Cita
          </h3>

          {!reservaSeleccionada ? (
            <p className="text-gray-500 text-sm text-center mt-10">
              Haz clic en una etiqueta del calendario para ver los detalles y opciones.
            </p>
          ) : (
            <div className="text-sm text-slate-700 animate-in fade-in">
              {/* Formulario de Edición */}
              <form 
                onSubmit={async (e) => {
                  e.preventDefault();

                  await fetch(`/api/reservaciones/${reservaSeleccionada._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(reservaSeleccionada),
                  });
                  cargarReservaciones();
                  alert("Reserva actualizada");
                }} 
                className="flex flex-col gap-3"
              >
                <label className="font-bold text-xs">Servicio:</label>
                <input type="text" value={reservaSeleccionada.title} onChange={e => setReservaSeleccionada({...reservaSeleccionada, title: e.target.value})} className="p-2 border rounded" required />
                
                <label className="font-bold text-xs mt-2">Cliente:</label>
                <input type="text" value={reservaSeleccionada.cliente} onChange={e => setReservaSeleccionada({...reservaSeleccionada, cliente: e.target.value})} className="p-2 border rounded" required />
                
                <label className="font-bold text-xs mt-2">Fecha (YYYY-MM-DD):</label>
                <input type="date" value={reservaSeleccionada.start} onChange={e => setReservaSeleccionada({...reservaSeleccionada, start: e.target.value})} className="p-2 border rounded" required />
                
                <label className="font-bold text-xs mt-2">Detalles:</label>
                <textarea value={reservaSeleccionada.descripcion} onChange={e => setReservaSeleccionada({...reservaSeleccionada, descripcion: e.target.value})} className="p-2 border rounded h-20" />

                <div className="flex flex-col gap-2 mt-4">
                  <button type="submit" className="w-full bg-[#da3743] text-white py-2 rounded-md font-bold text-sm hover:bg-[#b8222d] transition">
                    💾 Guardar Cambios
                  </button>
                  <button type="button" onClick={() => handleEliminar(reservaSeleccionada._id)} className="w-full bg-white border border-[#da3743] text-[#da3743] py-2 rounded-md font-bold text-sm hover:bg-red-50 transition">
                    🗑️ Cancelar Cita
                  </button>
                  <button type="button" onClick={() => setReservaSeleccionada(null)} className="w-full bg-gray-200 text-slate-700 py-2 rounded-md font-bold text-sm hover:bg-gray-300 transition mt-2">
                    Cerrar Panel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}