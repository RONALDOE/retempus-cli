import { useState, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '@contexts/auth.context';

function Forgot() {
  // Contexto de autenticación
  const authContext = useContext(AuthContext);

  const params = useParams();
  const navigate = useNavigate();  // For redirecting after password reset

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const token = params.token;
  const { reset } = authContext;

  // Estado para la contraseña
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  // Estado para los errores
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({
    password: '',
    confirmPassword: '',
  });

  // Estado para mensajes de éxito
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Función para manejar el envío del formulario de recuperación de contraseña
  const handleReset = async () => {
    // Resetear errores y mensajes
    setErrors({});
    setSuccessMessage(null);

    // Validación: si la contraseña no está vacía
    if (!password) {
      setErrors((prev) => ({
        ...prev,
        password: 'Password is required',
      }));
      return;
    }

    // Validación: si las contraseñas no coinciden
    if (password !== confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: 'Passwords do not match',
      }));
      return;
    }

    try {
      // Intentar la recuperación de la contraseña
      const result = await reset(token!, password);

      if (result.status === 200) {
        // Si la recuperación fue exitosa, mostrar mensaje de éxito
        setSuccessMessage(result.message || 'Contraseña cambiada correctamente.');

        // Esperar 3 segundos antes de redirigir
        setTimeout(() => {
          navigate('/login');  // Redirige al login
        }, 3000);
      } else {
        // Si ocurrió un error, mostrar mensaje de error
        setErrors({ password: result.message || 'An error occurred, please try again.' });
      }
    } catch (error) {
      console.error("Error during password recovery:", error);
      setErrors({ password: 'An unexpected error occurred. Please try again later.' });
    }
  };

  return (
    <div className="min-h-screen min-w-screen flex justify-center items-center bg-gray-100" id="forgot">
      {/* Overlay para oscurecer el fondo */}
      <div className="absolute inset-0 bg-black opacity-40 z-0"></div>

      {/* Contenedor del formulario de recuperación */}
      <div className="w-[30rem] max-w-full h-auto bg-white rounded-lg shadow-xl relative z-10 p-8 flex flex-col gap-6">
        <h1 className="text-3xl font-semibold text-gray-800 border-b pb-4">Forgot Password</h1>

        {/* Campo de Contraseña */}
        <div className="w-full">
          <label htmlFor="password" className="block text-lg text-gray-600 mb-2">Password</label>
          <div className="relative w-full">
            <input
              type={isPasswordVisible ? "text" : "password"}
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-2 pr-12 rounded-lg text-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-400`}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 px-4 flex items-center justify-center bg-[#121212] rounded-r-lg text-white font-semibold hover:bg-[#1a1a1a] transition duration-300"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              Show
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        {/* Campo de Confirmación de Contraseña */}
        <div className="w-full">
          <label htmlFor="confirmPassword" className="block text-lg text-gray-600 mb-2">Confirm Password</label>
          <input
            type={isPasswordVisible ? "text" : "password"}
            name="confirmPassword"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`w-full px-4 py-2 rounded-lg text-lg border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-400`}
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
        </div>

        {/* Mostrar el mensaje de éxito si lo hay */}
        {successMessage && (
          <p className="text-green-500 text-sm mt-2">{successMessage}</p>
        )}

        {/* Botón de Enviar */}
        <button
          onClick={handleReset}
          className="w-full py-3 bg-[#121212] text-white rounded-lg text-lg font-semibold hover:bg-[#1a1a1a] transition duration-300 ease-in-out"
        >
          Reset Password
        </button>

        {/* Enlace para volver al login */}
        <div className="text-center">
          <Link to="/login" className="text-sm text-gray-600 hover:underline">Back to login</Link>
        </div>
      </div>
    </div>
  );
}

export default Forgot;
