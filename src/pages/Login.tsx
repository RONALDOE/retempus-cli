import { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '@contexts/auth.context'

function Login() {
  // Contexto de autenticación
  const authContext = useContext(AuthContext)

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { login } = authContext
  // Estado para el usuario y contraseña
  const [usernameOrEmail, setUsernameOrEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false)

  // Estado para los errores
  const [errors, setErrors] = useState<{ usernameOrEmail?: string; password?: string }>({
    usernameOrEmail: '',
    password: '',
  });

  // Función para manejar el login con verificación de errores
  const handleLogin = async () => {
    // Resetear errores al hacer un nuevo intento
    setErrors({});

    // Validar si los campos están llenos
    if (!usernameOrEmail || !password) {
      setErrors((prev) => ({
        ...prev,
        usernameOrEmail: !usernameOrEmail ? 'Username or email is required' : '',
        password: !password ? 'Password is required' : '',
      }));
      return;
    }

    try {
      // Intentar el login
      const success = await login({ usernameOrEmail, password });

      // Si el login falla, mostrar mensaje de error
      if (!success) {
        setErrors({ usernameOrEmail: 'Invalid username/email or password', password: '' });
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrors({ usernameOrEmail: 'An error occurred, please try again.', password: '' });
    }
  };

  return (
    <div className='min-h-screen min-w-screen flex justify-center items-center relative' id='login'>
      {/* Overlay para oscurecer el fondo */}
      <div className="absolute inset-0 bg-black opacity-50 z-0"></div>

      {/* Contenedor del Login */}
      <div className='w-[30rem] h-[35rem] flex flex-col justify-center items-center bg-white rounded-lg gap-8 shadow-2xl relative z-10 p-8'>
        <h1 className='text-3xl font-semibold text-gray-700 border-b border-gray-300 pb-4'>Login</h1>

        {/* Campo de Usuario */}
        <div className='w-full'>
          <label htmlFor="username" className='block text-lg text-gray-600 mb-2'>Username</label>
          <input 
            type="text" 
            name="Username" 
            id="username" 
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            className='w-full px-4 py-2 rounded-lg text-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400'
          />
          {/* Mostrar el error si existe */}
          {errors.usernameOrEmail && <p className="text-red-500 text-sm">{errors.usernameOrEmail}</p>}
        </div>
        
        {/* Campo de Contraseña con botón al costado derecho */}
        <div className='w-full'>
          <label htmlFor="password" className='block text-lg text-gray-600 mb-2'>Password</label>
          <div className='relative w-full'>
            <input 
              type={isPasswordVisible ? "text" : "password"} 
              name="Password" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full px-4 py-2 pr-12 rounded-lg text-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400'
            />
            <button 
              className='absolute inset-y-0 right-0 px-4 flex items-center justify-center bg-[#121212] rounded-r-lg text-white font-semibold hover:bg-[#1a1a1a] transition duration-300'
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              Show
            </button>
          </div>
          {/* Mostrar el error si existe */}
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
        </div>

        {/* Botón de Iniciar Sesión */}
        <button 
          onClick={handleLogin} 
          className='mt-6  w-11/12 py-3 bg-[#121212] text-white rounded-lg text-lg font-semibold hover:bg-[#1a1a1a] transition duration-300 ease-in-out'
        >
          Log In
        </button>

        {/* Enlace para recuperar contraseña */}
        <div className='flex flex-col items-center justify-center'>
          
        <Link to="/register" className='text-[#121212] text-lg font-semibold hover:underline'>No account? Register</Link>
        <Link to="/forgot" className='text-[#121212] text-lg font-semibold hover:underline'>Forgot your password?</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
