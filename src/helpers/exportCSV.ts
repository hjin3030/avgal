// src/helpers/exportCSV.ts
export function exportToCSV<T>(data: T[], filename = "data") {
  if (!data || data.length === 0) return;

  const header = Object.keys(data[0]);
  const csvContent =
    header.join(",") +
    "\n" +
    data
      .map(row =>
        header
          .map(field => {
            const val = (row as any)[field] ?? "";
            // Escapa comillas
            return `"${val.toString().replace(/"/g, '""')}"`;
          })
          .join(",")
      )
      .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
