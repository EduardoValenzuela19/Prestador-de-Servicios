import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Reservation from '@/models/Reservation';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await connectToDatabase();
    const reservas = await Reservation.find();
    return NextResponse.json(reservas);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener reservaciones' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { title, start, cliente, descripcion } = body;


    const accountIdPrueba = new mongoose.Types.ObjectId("64b0f0a8e4b0a1a2b3c4d5e6");

    const nuevaReserva = await Reservation.create({ 
      accountId: accountIdPrueba,
      title, 
      start: new Date(start), 
      cliente, 
      descripcion
    });

    return NextResponse.json(nuevaReserva, { status: 201 });
  } catch (error) {
    console.error("Error al crear reserva:", error);
    return NextResponse.json({ error: 'Error al crear la reservación' }, { status: 500 });
  }
}