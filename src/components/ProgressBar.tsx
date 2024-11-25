import React from "react";

interface ProgressBarProps {
  total: number; // Capacidad total en bytes
  used: number; // Capacidad usada en bytes
}

// Función para convertir bytes a la unidad más adecuada
const formatBytes = (bytes: number): { value: number; unit: string } => {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return { value: 0, unit: "Bytes" };
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / Math.pow(1024, i);
  return { value: parseFloat(value.toFixed(2)), unit: sizes[i] };
};

const ProgressBar: React.FC<ProgressBarProps> = ({ total, used }) => {
  // Convertimos los valores a unidades legibles
  const totalFormatted = formatBytes(total);
  const usedFormatted = formatBytes(used);

  // Calculamos el porcentaje usado
  const percentageUsed = total > 0 ? (used / total) * 100 : 0;

  return (
    <div className="w-full max-w-lg mx-auto text-center">
      {/* Barra de progreso */}
      <div className="text-sm flex justify-between items-center w-full text-gray-700 mb-2">
        <span className="text-xl">
          {usedFormatted.value} {usedFormatted.unit}
        </span>
        <span className="text-xl">
          {totalFormatted.value} {totalFormatted.unit}
        </span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full">
        <div
          className="h-full bg-green-500 rounded-full"
          style={{ width: `${percentageUsed}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
