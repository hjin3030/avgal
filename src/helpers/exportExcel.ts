// src/helpers/exportExcel.ts
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export function exportToExcel<T>(data: T[], filename = "data") {
  if (!data || data.length === 0) return;

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

  saveAs(blob, `${filename}.xlsx`);
}
