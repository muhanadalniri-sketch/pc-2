import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

type MonthlySummary = {
  monthLabel: string;
  woCompleted: number;
  wnscCompleted: number;
  avgWnscDuration: number;
};

export const exportMonthlyPDF = async (summaries: MonthlySummary[]) => {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595.28, 841.89]); // A4 portrait points
  const { width, height } = page.getSize();
  const margin = 48;
  const font = await pdf.embedFont(StandardFonts.Helvetica);

  page.drawText('Monthly Summary', { x: margin, y: height - margin - 10, size: 20, font, color: rgb(0,0,0) });

  const headers = ['Month', 'WO Completed', 'WNSC Completed', 'Avg WNSC Duration (days)'];
  const colX = [margin, margin+160, margin+320, margin+430];
  let y = height - margin - 40;
  const rowH = 20;

  const drawRow = (cells: string[], bold = false) => {
    for (let i = 0; i < cells.length; i++) {
      page.drawText(cells[i], { x: colX[i], y, size: bold ? 12 : 11, font, color: rgb(0,0,0) });
    }
  };

  drawRow(headers, true);
  y -= rowH;

  for (const s of summaries) {
    drawRow([s.monthLabel, String(s.woCompleted), String(s.wnscCompleted), String(s.avgWnscDuration)]);
    y -= rowH;
    if (y < margin + 40) {
      // new page
      const p2 = pdf.addPage([595.28, 841.89]);
      y = height - margin;
    }
  }

  const bytes = await pdf.save();
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'monthly-summary.pdf';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};
