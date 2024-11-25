import { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '@contexts/auth.context'


function Forgot() {
    // Contexto de autenticación
    const authContext = useContext(AuthContext)

    

    if (!authContext) {
        throw new Error("AuthContext must be used within an AuthProvider");
    }

    const {recover} = authContext;
    // Estado para el email
    const [email, setEmail] = useState<string>('')

    // Estado para los errores
    const [errors, setErrors] = useState<{ email?: string }>({
        email: '',
    });

    // Estado para mensajes de éxito
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Función para manejar el envío del correo de recuperación
    const handleRecover = async () => {
        // Resetear errores al hacer un nuevo intento
        setErrors({});
        setSuccessMessage(null);  // Reset success message

        // Validar si el campo de email está lleno
        if (!email) {
            setErrors((prev) => ({
                ...prev,
                email: 'Email is required',
            }));
            return;
        }

        try {
            // Intentar la recuperación de la contraseña
            const result = await recover(email);

            if (result.status === 200) {
                // Si la recuperación fue exitosa, mostrar mensaje de éxito
                setSuccessMessage(result.message || 'Please check your email for further instructions.');
            } else {
                // Si ocurrió un error, mostrar mensaje de error
                setErrors({ email: result.message || 'An error occurred, please try again.' });
            }
        } catch (error) {
            console.error("Error during password recovery:", error);
            setErrors({ email: 'An unexpected error occurred. Please try again later.' });
        }
    };

    return (
        <div className="min-h-screen min-w-screen flex justify-center items-center bg-gray-100" id='forgot'>
            {/* Overlay para oscurecer el fondo */}
            <div className="absolute inset-0 bg-black opacity-40 z-0"></div>

            {/* Contenedor del formulario de recuperación */}
            <div className="w-[30rem] max-w-full h-auto bg-white rounded-lg shadow-xl relative z-10 p-8 flex flex-col gap-6">
                <h1 className="text-3xl font-semibold text-gray-800 border-b pb-4">Forgot Password</h1>

                {/* Campo de Email */}
                <div className="w-full">
                    <label htmlFor="email" className="block text-lg text-gray-600 mb-2">Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg text-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {/* Mostrar el error si existe */}
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                {/* Mostrar el mensaje de éxito si lo hay */}
                {successMessage && (
                    <p className="text-green-500 text-sm mt-2">{successMessage}</p>
                )}

                {/* Botón de Enviar */}
                <button
                    onClick={handleRecover}
                    className="w-full py-3 bg-[#121212] text-white rounded-lg text-lg font-semibold hover:bg-[#1a1a1a] transition duration-300 ease-in-out"
                >
                    Send Recovery Email
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
