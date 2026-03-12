import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import ServicioMenu from '@/models/Inventario';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    

    const { id } = await params; 
    
    const body = await request.json();
    const { titulo, descripcion, precio, categoria, horarios } = body;
    

    let horariosArray = [];
    if (typeof horarios === 'string') {
      horariosArray = horarios ? horarios.split(',').map((h: string) => h.trim()) : [];
    } else if (Array.isArray(horarios)) {
      horariosArray = horarios;
    }

    const servicioActualizado = await ServicioMenu.findByIdAndUpdate(
      id, 
      { titulo, descripcion, precio, categoria, horarios: horariosArray },
      { new: true, runValidators: true } 
    );

    return NextResponse.json(servicioActualizado);
  } catch (error) {
    console.error("Error al actualizar:", error);
    return NextResponse.json({ error: 'Error al actualizar el servicio' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    
    const { id } = await params;

    await ServicioMenu.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'Servicio eliminado correctamente' });
  } catch (error) {
    return NextResponse.json({ error: 'Error al borrar el servicio' }, { status: 500 });
  }
}