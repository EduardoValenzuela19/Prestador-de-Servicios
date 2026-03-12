import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Coupon from '@/models/Coupon';


export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    
 
    const { id } = await params;

    await Coupon.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'Cupón eliminado' });
  } catch (error) {
    return NextResponse.json({ error: 'Error al borrar el cupón' }, { status: 500 });
  }
}