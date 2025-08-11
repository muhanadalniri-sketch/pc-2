'use client';
import React, { useEffect, useRef } from 'react';
import { Chart, BarController, BarElement, LinearScale, CategoryScale, Tooltip, Legend } from 'chart.js';
import { prefersReducedMotion } from '@/lib/motion';

Chart.register(BarController, BarElement, LinearScale, CategoryScale, Tooltip, Legend);

export default function ChartWnscDurations({ edges, counts }: { edges: number[]; counts: number[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const ctx = canvasRef.current!.getContext('2d')!;
    const reduced = prefersReducedMotion();
    const labels = counts.map((_, i) => `${edges[i]}-${edges[i+1]-1}`);
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'WNSC durations (days)',
          data: counts,
          backgroundColor: '#f43f5e'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } },
        animation: reduced ? false : { duration: 500 },
      }
    });
    return () => chart.destroy();
  }, [edges, counts]);
  return <div className="h-56"><canvas ref={canvasRef} aria-label="WNSC durations histogram"></canvas></div>;
}
