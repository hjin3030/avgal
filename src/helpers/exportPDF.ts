// src/helpers/exportPDF.ts
import jsPDF from "jspdf";
import "jspdf-autotable";

export function exportToPDF<T>(data: T[], filename = "data") {
  if (!data || data.length === 0) return;

  const doc = new jsPDF();
  const keys = Object.keys(data[0]);
  const body = data.map(row => keys.map(key => (row as any)[key]));

  (doc as any).autoTable({ head: [keys], body });
  doc.save(`${filename}.pdf`);
}
