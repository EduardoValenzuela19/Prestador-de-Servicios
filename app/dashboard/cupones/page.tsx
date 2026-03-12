'use client';
import { useState, useEffect } from 'react';

export default function CuponesPage() {
  const [cupones, setCupones] = useState<any[]>([]);
  const [codigo, setCodigo] = useState('');
  const [descuento, setDescuento] = useState('');
  const [fechaAplicacion, setFechaAplicacion] = useState('');

  const cargarCupones = async () => {
    const res = await fetch('/api/cupones');
    if (res.ok) setCupones(await res.json());
  };

  useEffect(() => { cargarCupones(); }, []);

  const handleGuardarCupon = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/cupones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ codigo, descuento, fechaAplicacion }),
    });
    if (res.ok) {
      cargarCupones();
      setCodigo(''); setDescuento(''); setFechaAplicacion('');
    }
  };

  const handleEliminar = async (id: string) => {
    if (confirm("¿Borrar este cupón?")) {
      await fetch(`/api/cupones/${id}`, { method: 'DELETE' });
      cargarCupones();
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold border-b border-gray-200 pb-2 mb-2">Cupones / Promociones</h1>
      <div className="flex gap-8 items-start mt-5">
        
        {/* Lista de Cupones */}
        <div className="flex-[2] flex flex-col gap-3">
          {cupones.length === 0 ? <p className="text-gray-500">No hay cupones activos.</p> : 
            cupones.map(c => (
              <div key={c._id} className="border p-4 rounded-lg flex justify-between items-center shadow-sm">
                <div>
                  <h4 className="font-bold text-[#da3743]">{c.codigo}</h4>
                  <p className="text-sm">{c.descuento} • Vence: {new Date(c.fechaAplicacion).toLocaleDateString()}</p>
                </div>
                <button onClick={() => handleEliminar(c._id)} className="text-red-500 border border-red-200 p-2 rounded hover:bg-red-50">🗑️</button>
              </div>
            ))
          }
        </div>

        {/* Formulario */}
        <div className="flex-[1] bg-gray-50 border p-6 rounded-xl">
          <h3 className="font-bold mb-4">Nuevo Cupón</h3>
          <form onSubmit={handleGuardarCupon} className="flex flex-col gap-4">
            <input type="text" value={codigo} onChange={e => setCodigo(e.target.value)} placeholder="Código (Ej. VERANO20)" className="p-2 border rounded" required />
            <input type="text" value={descuento} onChange={e => setDescuento(e.target.value)} placeholder="Descuento (Ej. 20%)" className="p-2 border rounded" required />
            <input type="date" value={fechaAplicacion} onChange={e => setFechaAplicacion(e.target.value)} className="p-2 border rounded" required />
            <button type="submit" className="bg-[#da3743] text-white p-2 rounded font-bold hover:bg-[#b8222d]">Añadir Cupón</button>
          </form>
        </div>
      </div>
    </div>
  );
}