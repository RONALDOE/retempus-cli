import React from "react";

interface ProgressBarProps {
  total: number; // Capacidad total (GB)
  used: number; // Capacidad usada (GB)
}

const ProgressBar: React.FC<ProgressBarProps> = ({ total, used }) => {
  // Calculamos el porcentaje usado
  const percentageUsed = (used / total) * 100;

  return (
    <div className='w-full max-w-lg mx-auto text-center'>
      {/* Barra de progreso */}
      <div className='text-sm flex justify-between items-center w-full text-gray-700 mb-2'>
        <span className="text-xl">{total}GB</span>
        <span className="text-xl">{used}GB</span>
      </div>
      <div className='w-full h-2 bg-gray-200 rounded-full'>
        <div
          className='h-full bg-green-500 rounded-full'
          style={{ width: `${percentageUsed}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
