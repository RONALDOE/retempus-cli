import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Registra los elementos necesarios para Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

// Define el tipo para los datos que recibirás en la prop
interface SpaceData {
  name: string;
  totalSpace: number;
  usedSpace: number;
}

interface AnalysisCardProps {
  data: SpaceData[];
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({ data }) => {
  // Calcula el espacio total y usado
  const totalSpace = data.reduce((acc, item) => acc + item.totalSpace, 0);
  const usedSpace = data.reduce((acc, item) => acc + item.usedSpace, 0);

  // Datos para el gráfico
  const chartData = {
    labels: ['Used Space', 'Free Space'],
    datasets: [
      {
        data: [usedSpace, totalSpace - usedSpace],
        backgroundColor: ['#FF6384', '#36A2EB'], // Colores para usado y libre
        hoverBackgroundColor: ['#FF6384', '#36A2EB'],
      },
    ],
  };

  return (
    <div className="w-full h-96 shadow-xl items-center justify-center flex flex-col rounded-xl p-4">
      <h2 className="text-lg font-semibold mb-4">Space Usage</h2>
      <div className="w-full h-4/5 flex items-center justify-center">
        <Doughnut data={chartData} />
      </div>
      <div className="mt-4 text-center">
        <p>Total Space: {totalSpace} GB</p>
        <p>Used Space: {usedSpace} GB</p>
      </div>
    </div>
  );
}

export default AnalysisCard;
