'use client';

import { useEffect, useRef } from 'react';
import { Chart, DoughnutController, ArcElement, Tooltip } from 'chart.js';

Chart.register(DoughnutController, ArcElement, Tooltip);

const OccupancyChart = ({ occupancyPercentage }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    if (chartInstance.current) {
      chartInstance.current.destroy(); // destroy previous chart
    }

    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Occupied', 'Available'],
        datasets: [
          {
            data: [occupancyPercentage, 100 - occupancyPercentage],
            backgroundColor: ['#3b82f6', '#e5e7eb'], // blue & light gray
            borderWidth: 0,
          },
        ],
      },
      options: {
        cutout: '70%',
        plugins: {
          tooltip: { enabled: false },
        },
      },
    });
  }, [occupancyPercentage]);

  return (
    <div className="relative h-32 w-32">
      <canvas ref={chartRef}></canvas>
      <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-primary dark:text-white">
        {occupancyPercentage}%
      </div>
    </div>
  );
};

export default OccupancyChart;
