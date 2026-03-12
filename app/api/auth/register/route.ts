import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Account from '@/models/Account';


export async function POST(request: Request) {
  try {

    await connectToDatabase();
    

    const body = await request.json();
    const { name, email, password } = body;


    const existe = await Account.findOne({ email });
    
    if (existe) {

      return NextResponse.json({ error: 'El correo ya está registrado.' }, { status: 400 });
    }


    const newUser = await Account.create({ 
      name, 
      email, 
      password,
      role: 'user' 
    });


    return NextResponse.json({ 
      success: true, 
      user: { 
        id: newUser._id, 
        name: newUser.name, 
        email: newUser.email, 
        role: newUser.role 
      } 
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: 'Error al registrar la cuenta' }, { status: 500 });
  }
}