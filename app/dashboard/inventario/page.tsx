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

export default function InventarioPage() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [cargando, setCargando] = useState(true);

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoria, setCategoria] = useState('');
  const [horarios, setHorarios] = useState('');

  const [editandoId, setEditandoId] = useState<string | null>(null);




  const cargarServicios = async () => {
    try {
      const res = await fetch('/api/inventario');
      if (res.ok) {
        const data = await res.json();
        setServicios(data);
      }
    } catch (error) {
      console.error("Error al cargar servicios:", error);
    } finally {
      setCargando(false);
    }
  };


  useEffect(() => {
    cargarServicios();
  }, []);


  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = { titulo, descripcion, precio, categoria, horarios };
    

    const url = editandoId ? `/api/inventario/${editandoId}` : '/api/inventario';
    const method = editandoId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        cargarServicios();
        cancelarEdicion();
      } else {
        alert("Ocurrió un error al guardar.");
      }
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };


  const handleEliminar = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este servicio de forma permanente?")) {
      try {
        const res = await fetch(`/api/inventario/${id}`, { method: 'DELETE' });
        if (res.ok) {
          cargarServicios(); 
        }
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };




  const iniciarEdicion = (servicio: Servicio) => {
    setTitulo(servicio.titulo);
    setDescripcion(servicio.descripcion);
    setPrecio(servicio.precio);
    setCategoria(servicio.categoria);
    setHorarios(servicio.horarios.join(', '));
    setEditandoId(servicio._id);
  };


  const cancelarEdicion = () => {
    setTitulo('');
    setDescripcion('');
    setPrecio('');
    setCategoria('');
    setHorarios('');
    setEditandoId(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold border-b border-gray-200 pb-2 mb-2 text-slate-800">
        Gestión de Inventario
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        Se puede Crear, Editar o Eliminar registros
      </p>

      <div className="flex gap-8 items-start mt-5">
        
        {/* Serviciosa */}
        <div className="flex-[2] flex flex-col gap-4">
          {cargando ? (
            <p className="text-gray-500 italic">Cargando inventario...</p>
          ) : servicios.length === 0 ? (
            <p className="text-gray-500 italic">Aún no tienes servicios registrados. Crea uno en el panel lateral.</p>
          ) : (
            servicios.map((servicio) => (
              <div key={servicio._id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm flex justify-between items-center transition-all hover:border-[#da3743]">
                <div>
                  <h4 className="m-0 mb-1 text-slate-800 font-bold">{servicio.titulo}</h4>
                  <p className="m-0 text-xs text-gray-500">
                    <span className="font-semibold">{servicio.categoria || 'Servicio'}</span> • {servicio.precio}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => iniciarEdicion(servicio)}
                    className="bg-gray-100 text-slate-800 px-3 py-1.5 rounded text-xs font-bold hover:bg-gray-200 transition"
                  >
                    ✏️ Editar
                  </button>
                  <button 
                    onClick={() => handleEliminar(servicio._id)}
                    className="bg-white border border-[#da3743] text-[#da3743] px-3 py-1.5 rounded text-xs font-bold hover:bg-red-50 transition"
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Formulario */}
        <div className={`flex-[1] border p-5 rounded-lg sticky top-5 transition-colors ${editandoId ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 border-gray-200'}`}>
          <h3 className="mt-0 text-lg font-bold mb-4 text-slate-800">
            {editandoId ? '✏️ Editar Registro' : 'Nuevo Registro'}
          </h3>
          
          <form onSubmit={handleGuardar} className="flex flex-col gap-3">
            <div>
              <label className="block font-bold text-xs mb-1 text-slate-700">Nombre del Servicio / Producto:</label>
              <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded focus:outline-none focus:border-[#da3743]" required />
            </div>
            <div>
              <label className="block font-bold text-xs mb-1 text-slate-700">Descripción:</label>
              <input type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded focus:outline-none focus:border-[#da3743]" required />
            </div>
            <div>
              <label className="block font-bold text-xs mb-1 text-slate-700">Precio:</label>
              <input type="text" value={precio} onChange={(e) => setPrecio(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded focus:outline-none focus:border-[#da3743]" required />
            </div>
            <div>
              <label className="block font-bold text-xs mb-1 text-slate-700">Categoría:</label>
              <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded bg-white focus:outline-none focus:border-[#da3743]" required>
                <option value="" disabled>Selecciona una opción...</option>
                <option value="Servicio">Servicio</option>
                <option value="Comida">Comida / Cena</option>
                <option value="Bebida">Bebida</option>
                <option value="Habitación">Habitación / Espacio</option>
                <option value="Paquete">Paquete Completo</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-xs mb-1 text-slate-700">Horarios (Separados por coma):</label>
              <input type="text" value={horarios} onChange={(e) => setHorarios(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded focus:outline-none focus:border-[#da3743]" placeholder="Ej. 10:00, 11:00, 12:00" />
            </div>

            <button type="submit" className={`mt-4 p-3 text-white border-none rounded font-bold w-full transition-colors ${editandoId ? 'bg-orange-500 hover:bg-orange-600' : 'bg-[#da3743] hover:bg-[#b8222d]'}`}>
              {editandoId ? 'Actualizar Cambios' : 'Guardar Registro'}
            </button>

            {/* Cancelra edicion */}
            {editandoId && (
              <button type="button" onClick={cancelarEdicion} className="mt-1 p-3 bg-transparent text-slate-500 border border-slate-300 rounded font-bold w-full hover:bg-slate-100 transition-colors">
                Cancelar Edición
              </button>
            )}
          </form>
        </div>

      </div>
    </div>
  );
}