'use client';
import React, { useEffect, useRef } from 'react';
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Filler, Legend } from 'chart.js';
import { prefersReducedMotion } from '@/lib/motion';

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Filler, Legend);

export type SeriesPoint = { label: string; wo: number; wnsc: number };
export default function ChartCompletedOverTime({ data, showBoth }: { data: SeriesPoint[]; showBoth: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const ctx = canvasRef.current!.getContext('2d')!;
    const reduced = prefersReducedMotion();

    const gradientBlue = ctx.createLinearGradient(0, 0, 0, canvasRef.current!.height);
    gradientBlue.addColorStop(0, 'rgba(14,165,233,0.45)');
    gradientBlue.addColorStop(1, 'rgba(14,165,233,0.05)');

    const gradientRed = ctx.createLinearGradient(0, 0, 0, canvasRef.current!.height);
    gradientRed.addColorStop(0, 'rgba(244,63,94,0.45)');
    gradientRed.addColorStop(1, 'rgba(244,63,94,0.05)');

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map(d => d.label),
        datasets: showBoth ? [
          {
            label: 'WO Completed',
            data: data.map(d => d.wo),
            fill: true,
            backgroundColor: gradientBlue,
            borderColor: '#0ea5e9',
            pointRadius: 2,
            tension: reduced ? 0 : 0.25,
          },
          {
            label: 'WNSC Completed',
            data: data.map(d => d.wnsc),
            fill: true,
            backgroundColor: gradientRed,
            borderColor: '#f43f5e',
            pointRadius: 2,
            tension: reduced ? 0 : 0.25,
          },
        ] : [
          {
            label: 'Completed',
            data: data.map(d => d.wo + d.wnsc),
            fill: true,
            backgroundColor: gradientBlue,
            borderColor: '#0ea5e9',
            pointRadius: 2,
            tension: reduced ? 0 : 0.25,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true },
          tooltip: { intersect: false, mode: 'index' },
        },
        scales: {
          y: { beginAtZero: true }
        },
        animation: reduced ? false : { duration: 500 }
      }
    });

    return () => chart.destroy();
  }, [data, showBoth]);

  return <div className="h-64"><canvas ref={canvasRef} aria-label="Completed over time chart"></canvas></div>;
}
