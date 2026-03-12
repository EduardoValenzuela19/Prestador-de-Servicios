import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Account from '@/models/Account';


export async function POST(request: Request) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    const { email, password } = body;

    const user = await Account.findOne({ email }).select('+password');

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado.' }, { status: 404 });
    }

    if (user.password === password) {
      return NextResponse.json({ 
        success: true, 
        user: { 
          id: user._id, 
          name: user.name, 
          email: user.email, 
          role: user.role 
        } 
      });
    } else {
      return NextResponse.json({ error: 'Contraseña incorrecta.' }, { status: 401 });
    }

  } catch (error) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}