import { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '@contexts/auth.context'

function Register() {


  const authContext = useContext(AuthContext)


  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { register } = authContext
  // Estados para los campos del formulario
  const [user, setUser] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [fullName, setFullName] = useState<string>('')
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false)
  const [errors, setErrors] = useState<Record<string, string>>({}) // Estado para errores por campo

  const handleRegister = () => {
    const validationErrors: Record<string, string> = {}

    // Validación de campos vacíos
    if (!user.trim()) validationErrors.user = "Username is required"
    if (!fullName.trim()) validationErrors.fullName = "Full Name is required"
    if (!email.trim()) validationErrors.email = "Email is required"
    if (!password.trim()) validationErrors.password = "Password is required"
    if (!confirmPassword.trim()) validationErrors.confirmPassword = "Confirm Password is required"

    // Validación de longitud de la contraseña
    if (password.trim() && password.length < 8) {
      validationErrors.password = "Password must be at least 8 characters long"
    }

    // Validación de contraseñas iguales
    if (password.trim() && confirmPassword.trim() && password !== confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match"
    }

    // Actualizar errores
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    } else if (Object.keys(validationErrors).length === 0) {
      const payload = {
        username: user,
        email,
        password,
        name: fullName
      }

      register(payload)
    }



    // Si no hay errores, procesar el registro
    setErrors({}) // Limpiar errores
    console.log("User registered successfully:", { user, email })
    // Aquí puedes llamar a una API para registrar al usuario
  }

  return (
    <div
      className='min-h-screen min-w-screen flex justify-center items-center relative'
      id='register'
    >
      {/* Overlay para oscurecer el fondo */}
      <div className="absolute inset-0 bg-black opacity-50 z-0"></div>

      {/* Contenedor del Registro */}
      <div className='w-[30rem] h-auto flex flex-col justify-center items-center bg-white rounded-lg gap-4 shadow-2xl relative z-10 p-8'>
        <h1 className='text-3xl font-semibold text-gray-700 border-b border-gray-300 pb-4'>Register</h1>


        {/* Campo de NOmbre de Usuario wejeweje */}
        <div className='w-full'>
          <label htmlFor="username" className='block text-lg text-gray-600 mb-2'>Full Name</label>
          <input
            type="text"
            name="Full Name"
            id="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={`w-full px-4 py-2 rounded-lg text-lg border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-400`}
          />
          {errors.fullName && <p className='text-red-500 text-sm mt-1'>{errors.fullName}</p>}
        </div>

        {/* Campo de Usuario */}
        <div className='w-full'>
          <label htmlFor="username" className='block text-lg text-gray-600 mb-2'>Username</label>
          <input
            type="text"
            name="Username"
            id="username"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className={`w-full px-4 py-2 rounded-lg text-lg border ${errors.user ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-400`}
          />
          {errors.user && <p className='text-red-500 text-sm mt-1'>{errors.user}</p>}
        </div>

        {/* Campo de Correo */}
        <div className='w-full'>
          <label htmlFor="email" className='block text-lg text-gray-600 mb-2'>Email</label>
          <input
            type="email"
            name="Email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-4 py-2 rounded-lg text-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-400`}
          />
          {errors.email && <p className='text-red-500 text-sm mt-1'>{errors.email}</p>}
        </div>

        {/* Campo de Contraseña */}
        <div className='w-full'>
          <label htmlFor="password" className='block text-lg text-gray-600 mb-2'>Password</label>
          <div className='relative w-full'>
            <input
              type={isPasswordVisible ? "text" : "password"}
              name="Password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-2 pr-12 rounded-lg text-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-400`}
            />
            <button
              className='absolute inset-y-0 right-0 px-4 flex items-center justify-center bg-[#121212] rounded-r-lg text-white font-semibold hover:bg-[#1a1a1a] transition duration-300'
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              Show
            </button>
          </div>
          {errors.password && <p className='text-red-500 text-sm mt-1'>{errors.password}</p>}
        </div>

        {/* Campo de Confirmación de Contraseña */}
        <div className='w-full'>
          <label htmlFor="confirmPassword" className='block text-lg text-gray-600 mb-2'>Confirm Password</label>
          <input
            type={isPasswordVisible ? "text" : "password"}
            name="ConfirmPassword"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`w-full px-4 py-2 rounded-lg text-lg border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-400`}
          />
          {errors.confirmPassword && <p className='text-red-500 text-sm mt-1'>{errors.confirmPassword}</p>}
        </div>

        {/* Botón de Registrarse */}
        <button
          onClick={handleRegister}
          className='mt-4 w-11/12 py-3 bg-[#121212] text-white rounded-lg text-lg font-semibold hover:bg-[#1a1a1a] transition duration-300 ease-in-out'
        >
          Sign Up
        </button>

        {/* Enlace para iniciar sesión */}
        <Link to="/login" className='text-[#121212] text-lg font-semibold hover:underline'>Already have an account? Log in</Link>
      </div>
    </div>
  )
}

export default Register
