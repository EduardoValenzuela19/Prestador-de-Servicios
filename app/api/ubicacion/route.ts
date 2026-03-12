import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Location from '@/models/Location';

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    

    const body = await request.json();
    const { locationName, city, address } = body;


    const accountIdPrueba = "64b0f0a8e4b0a1a2b3c4d5e6";


    const nuevaUbicacion = await Location.create({ 
      accountId: accountIdPrueba, 
      locationName, 
      city, 
      address 
    });

   
    return NextResponse.json({ 
      success: true, 
      ubicacion: nuevaUbicacion 
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: 'Error al guardar la ubicación' }, { status: 500 });
  }
}