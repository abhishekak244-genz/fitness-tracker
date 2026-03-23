import React, { useRef, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale,
  BarElement, LineElement, PointElement,
  Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, LinearScale,
  BarElement, LineElement, PointElement,
  Title, Tooltip, Legend, Filler
);

const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: '#1E1E1E',
      borderColor: 'rgba(93,214,44,0.3)',
      borderWidth: 1,
      titleColor: '#F5F5F5',
      bodyColor: '#AAAAAA',
      padding: 12,
      cornerRadius: 8,
    },
  },
  scales: {
    x: {
      grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
      ticks: { color: '#666', font: { family: "'Outfit', sans-serif", size: 11 } },
    },
    y: {
      grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
      ticks: { color: '#666', font: { family: "'Outfit', sans-serif", size: 11 } },
    },
  },
};

export function VolumeBarChart({ data }) {
  const chartData = {
    labels: data.map(d => d.day),
    datasets: [{
      label: 'Volume (kg)',
      data: data.map(d => d.volume),
      backgroundColor: data.map(d => d.volume > 0 ? 'rgba(93,214,44,0.7)' : 'rgba(93,214,44,0.1)'),
      borderColor: data.map(d => d.volume > 0 ? '#5DD62C' : 'rgba(93,214,44,0.2)'),
      borderWidth: 1,
      borderRadius: 6,
      borderSkipped: false,
    }],
  };

  return (
    <div style={{ height: 200 }}>
      <Bar data={chartData} options={commonOptions} />
    </div>
  );
}

export function FrequencyLineChart({ data }) {
  const labels = Object.keys(data).slice(-6);
  const values = labels.map(k => data[k] || 0);

  const chartData = {
    labels,
    datasets: [{
      label: 'Workouts',
      data: values,
      borderColor: '#5DD62C',
      backgroundColor: 'rgba(93,214,44,0.08)',
      borderWidth: 2.5,
      pointBackgroundColor: '#5DD62C',
      pointBorderColor: '#0F0F0F',
      pointBorderWidth: 2,
      pointRadius: 5,
      tension: 0.4,
      fill: true,
    }],
  };

  return (
    <div style={{ height: 200 }}>
      <Line data={chartData} options={commonOptions} />
    </div>
  );
}

export default function ProgressChart({ type = 'bar', data }) {
  if (type === 'line') return <FrequencyLineChart data={data} />;
  return <VolumeBarChart data={data} />;
}