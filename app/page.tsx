'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {

  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); 

  
  const [errorMensaje, setErrorMensaje] = useState('');
  const [cargando, setCargando] = useState(false);


  const handleIngresar = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setErrorMensaje(''); 
    setCargando(true); 

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const payload = isLogin 
      ? { email, password } 
      : { name, email, password };

    try {

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();


      if (!res.ok) {
        throw new Error(data.error || 'Ocurrió un error inesperado');
      }


      
  
      router.push('/dashboard/calendario');

    } catch (err: any) {

      setErrorMensaje(err.message);
    } finally {

      setCargando(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50 text-slate-800 font-sans">
      <div className="bg-white p-10 rounded-xl shadow-sm w-[350px] border border-gray-200">
        
        <h2 className="text-[#da3743] mt-0 text-center text-2xl font-bold">
          {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
        </h2>
        <p className="text-center text-gray-500 text-sm mb-6">
          Panel de Administración de Prestador de Servicios
        </p>

        <form onSubmit={handleIngresar} className="flex flex-col gap-4">
          
          {/* Mostrar el error */}
          {errorMensaje && (
            <div className="bg-red-50 text-red-600 p-3 rounded text-sm text-center border border-red-100 font-medium">
              {errorMensaje}
            </div>
          )}

          {/* Campo Nombre */}
          {!isLogin && (
            <div>
              <label className="block font-bold text-xs mb-1 text-slate-700">Nombre del Negocio:</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Spa Relax" 
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-[#da3743]" 
                required={!isLogin} 
              />
            </div>
          )}

          <div>
            <label className="block font-bold text-xs mb-1 text-slate-700">Correo Electrónico:</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com" 
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-[#da3743]" 
              required 
            />
          </div>

          <div>
            <label className="block font-bold text-xs mb-1 text-slate-700">Contraseña:</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-[#da3743]" 
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={cargando}
            className="mt-2 w-full p-3.5 bg-[#da3743] text-white rounded font-bold text-base hover:bg-[#b8222d] transition-colors disabled:bg-gray-400"
          >
            {cargando ? 'Cargando...' : (isLogin ? 'Entrar al Panel' : 'Registrarse')}
          </button>
        </form>

        {/* Cambiar entre Login y Registro */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <span>{isLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}</span>
          <button 
            type="button"
            className="text-[#da3743] cursor-pointer font-bold underline bg-transparent border-none p-0"
            onClick={() => {
              setIsLogin(!isLogin);
              setErrorMensaje('');
            }}
          >
            {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
          </button>
        </div>
        
      </div>
    </div>
  );
}