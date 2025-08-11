'use client';
import React, { useEffect, useRef } from 'react';
import { Chart, BarController, BarElement, LinearScale, CategoryScale, Tooltip, Legend } from 'chart.js';
import { TOKENS } from '@/lib/tokens';
import { prefersReducedMotion } from '@/lib/motion';

Chart.register(BarController, BarElement, LinearScale, CategoryScale, Tooltip, Legend);

export default function ChartStatusBreakdown({ counts }: { counts: Record<'Open'|'WaitForApproval'|'Approved'|'Completed', number> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  React.useEffect(() => {
    const ctx = canvasRef.current!.getContext('2d')!;
    const reduced = prefersReducedMotion();
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Open','WaitForApproval','Approved','Completed'],
        datasets: [{
          label: 'WO',
          data: [counts.Open, counts.WaitForApproval, counts.Approved, counts.Completed],
          backgroundColor: [
            getComputedStyle(document.documentElement).getPropertyValue('--status-open') || '#0891b2',
            getComputedStyle(document.documentElement).getPropertyValue('--status-wait') || '#f59e0b',
            getComputedStyle(document.documentElement).getPropertyValue('--status-approved') || '#22c55e',
            getComputedStyle(document.documentElement).getPropertyValue('--status-completed') || '#3b82f6'
          ]
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
  }, [counts]);
  return <div className="h-56"><canvas ref={canvasRef} aria-label="WO status chart"></canvas></div>;
}
