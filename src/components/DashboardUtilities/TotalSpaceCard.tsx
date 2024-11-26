import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { formatBytes } from "@utils/helpers";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";

ChartJS.register(ArcElement, Tooltip, Legend);

interface SpaceData {
  totalSpace: number;
  usedSpace: number;
}

interface TotalSpaceCardProps {
  gauthTokens: string[]; // Array de gauthTokens
}

const TotalSpaceCard: React.FC<TotalSpaceCardProps> = ({ gauthTokens }) => {
  const [spaceData, setSpaceData] = useState<SpaceData>({ totalSpace: 0, usedSpace: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpaceData = async () => {
      try {
        let totalSpace = 0;
        let usedSpace = 0;
        // Realiza solicitudes para cada token usando Axios
        const requests = gauthTokens.map((token) =>
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/dashboard/driveInfo?accessToken=${token}`)
        );

        // Espera a que todas las solicitudes terminen
        const responses = await Promise.all(requests);

        // Suma los resultados de las respuestas
        responses.forEach((response) => {
          const { storageQuota } = response.data;
          totalSpace += storageQuota.limit;
          usedSpace += storageQuota.usage;
        });

        setSpaceData({ totalSpace, usedSpace });
      } catch (error) {
        console.error("Error al obtener los datos de espacio:", error);
      } finally {
        setLoading(false);
      }
    };

    if (gauthTokens.length > 0) {
      fetchSpaceData();
    }
  }, [gauthTokens]);

  if (loading) {
    return <div className="text-center">Loading space data...</div>;
  }

  const { totalSpace, usedSpace } = spaceData;

  const chartData = {
    labels: ["Used Space", "Free Space"],
    datasets: [
      {
        data: [formatBytes(usedSpace).value, formatBytes(totalSpace).value - formatBytes(usedSpace).value],
        backgroundColor: ["#FF6384", "#36A2EB"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB"],
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
        <p>Total Space: {formatBytes(totalSpace).value} {formatBytes(totalSpace).unit} </p>
        <p>Used Space: {formatBytes(usedSpace).value} {formatBytes(usedSpace).unit} </p>
      </div>
    </div>
  );
};

export default TotalSpaceCard;
