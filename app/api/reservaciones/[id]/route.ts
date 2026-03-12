import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Reservation from '@/models/Reservation';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    

    const { id } = await params;
    
    const body = await request.json();
    const { title, start, cliente, descripcion } = body;

    const reservaActualizada = await Reservation.findByIdAndUpdate(
      id, 
      { title, start: new Date(start), cliente, descripcion },
      { new: true, runValidators: true } 
    );

    return NextResponse.json(reservaActualizada);
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar reserva' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    
    const { id } = await params;

    await Reservation.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'Reserva eliminada' });
  } catch (error) {
    return NextResponse.json({ error: 'Error al borrar reserva' }, { status: 500 });
  }
}