import React from "react";
import { formatBytes } from "@utils/helpers";
interface ProgressBarProps {
  total: number; // Capacidad total en bytes
  used: number; // Capacidad usada en bytes
}

// Función para convertir bytes a la unidad más adecuada


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
