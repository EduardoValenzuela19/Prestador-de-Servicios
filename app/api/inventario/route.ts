import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import ServicioMenu from '@/models/Inventario'; 
import mongoose from 'mongoose';

export async function GET() {
  try {
    await connectToDatabase();

    const servicios = await ServicioMenu.find();
    return NextResponse.json(servicios);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener inventario' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    const { titulo, descripcion, precio, categoria, horarios } = body;
    
    const horariosArray = horarios ? horarios.split(',').map((h: string) => h.trim()) : [];


    const accountIdPrueba = new mongoose.Types.ObjectId("64b0f0a8e4b0a1a2b3c4d5e6");

    const nuevoServicio = await ServicioMenu.create({ 
      accountId: accountIdPrueba,
      titulo, 
      descripcion, 
      precio, 
      categoria, 
      horarios: horariosArray 
    });

    return NextResponse.json(nuevoServicio, { status: 201 });
  } catch (error) {
    console.error("Error al crear servicio:", error);
    return NextResponse.json({ error: 'Error al crear en inventario' }, { status: 500 });
  }
}