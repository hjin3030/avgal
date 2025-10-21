import { useState } from "react";

type SkuStock = {
  sku: string,
  nombre: string,
  total: number,
  c: number,
  b: number,
  u: number
};

const StockTable = ({ skus }: { skus: SkuStock[] }) => {
  const [search, setSearch] = useState("");
  const [sortedBy, setSortedBy] = useState<{ col: keyof SkuStock, asc: boolean }>({ col: "total", asc: false });

  let rows = skus.filter(
    r =>
      r.sku.includes(search) ||
      r.nombre.toLowerCase().includes(search.toLowerCase())
  );
  rows = rows.sort((a, b) =>
    sortedBy.asc
      ? Number(a[sortedBy.col]) - Number(b[sortedBy.col])
      : Number(b[sortedBy.col]) - Number(a[sortedBy.col])
  );

  return (
    <div className="w-full mb-8">
      <div className="flex mb-3 gap-3 items-center">
        <input
          className="border rounded px-3 py-1 text-sm max-w-xs"
          placeholder="Buscar SKU o nombre..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {/* Puedes agregar filtros de fechas aquí */}
      </div>
      <table className="w-full text-sm table-auto">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left cursor-pointer" onClick={() => setSortedBy({ col: "sku", asc: !sortedBy.asc })}>
              SKU {sortedBy.col === "sku" ? (sortedBy.asc ? "▲" : "▼") : ""}
            </th>
            <th className="p-2 text-left cursor-pointer" onClick={() => setSortedBy({ col: "nombre", asc: !sortedBy.asc })}>
              Nombre {sortedBy.col === "nombre" ? (sortedBy.asc ? "▲" : "▼") : ""}
            </th>
            <th className="p-2 text-right cursor-pointer" onClick={() => setSortedBy({ col: "total", asc: !sortedBy.asc })}>
              Total {sortedBy.col === "total" ? (sortedBy.asc ? "▲" : "▼") : ""}
            </th>
            <th className="p-2 text-right cursor-pointer" onClick={() => setSortedBy({ col: "c", asc: !sortedBy.asc })}>
              Cajas {sortedBy.col === "c" ? (sortedBy.asc ? "▲" : "▼") : ""}
            </th>
            <th className="p-2 text-right cursor-pointer" onClick={() => setSortedBy({ col: "b", asc: !sortedBy.asc })}>
              Bandejas {sortedBy.col === "b" ? (sortedBy.asc ? "▲" : "▼") : ""}
            </th>
            <th className="p-2 text-right cursor-pointer" onClick={() => setSortedBy({ col: "u", asc: !sortedBy.asc })}>
              Unidades {sortedBy.col === "u" ? (sortedBy.asc ? "▲" : "▼") : ""}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b">
              <td className="p-2">{row.sku}</td>
              <td className="p-2">{row.nombre}</td>
              <td className={`p-2 text-right font-semibold ${row.total < 0 ? "text-red-600 font-bold" : ""}`}>{row.total}</td>
              <td className={`p-2 text-right ${row.c < 0 ? "text-red-600 font-bold" : ""}`}>{row.c}</td>
              <td className={`p-2 text-right ${row.b < 0 ? "text-red-600 font-bold" : ""}`}>{row.b}</td>
              <td className={`p-2 text-right ${row.u < 0 ? "text-red-600 font-bold" : ""}`}>{row.u}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockTable;
