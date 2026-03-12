import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Coupon from '@/models/Coupon';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await connectToDatabase();
    const cupones = await Coupon.find();
    return NextResponse.json(cupones);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener cupones' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { codigo, descuento, fechaAplicacion } = body;


    const accountIdPrueba = new mongoose.Types.ObjectId("64b0f0a8e4b0a1a2b3c4d5e6");

    const nuevoCupon = await Coupon.create({ 
      accountId: accountIdPrueba,
      codigo, 
      descuento, 

      fechaAplicacion: new Date(fechaAplicacion) 
    });

    return NextResponse.json(nuevoCupon, { status: 201 });
  } catch (error) {
    console.error("Error al crear cupón:", error);
    return NextResponse.json({ error: 'Error al crear el cupón' }, { status: 500 });
  }
}