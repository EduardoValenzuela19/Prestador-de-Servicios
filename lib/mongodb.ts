import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb://127.0.0.1:27017/amenites';

if (!MONGODB_URI) {
  throw new Error('Por favor define la variable MONGODB');
}


let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      console.log('Base de Datos Conectada a Next.js');
      return mongoose;
    });
  }
  
  cached.conn = await cached.promise;
  return cached.conn;
}