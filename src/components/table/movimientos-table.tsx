import { useState } from "react";
type Movimiento = {
  id: number;
  tipo: string;
  fecha: string;
  sku: string;
  cajas: string;
  bandejas: string;
  unidades: string;
  total: number; // Total unidades, para orden
  estado: string;
};

const MovimientosTable = ({ data }: { data: Movimiento[] }) => {
  const [sortedBy, setSortedBy] = useState<{ col: string, asc: boolean }>({ col: "fecha", asc: false });

  const sortedData = [...data].sort((a, b) =>
    sortedBy.asc
      ? String(a[sortedBy.col as keyof Movimiento]).localeCompare(String(b[sortedBy.col as keyof Movimiento]))
      : String(b[sortedBy.col as keyof Movimiento]).localeCompare(String(a[sortedBy.col as keyof Movimiento]))
  );

  return (
    <div>
      <table className="w-full bg-white shadow rounded-lg text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-right cursor-pointer" onClick={()=>setSortedBy({col:"id",asc:!sortedBy.asc})}>ID {sortedBy.col==="id" ? (sortedBy.asc ? "▲":"▼"):""}</th>
            <th className="p-3 text-left cursor-pointer" onClick={()=>setSortedBy({col:"tipo",asc:!sortedBy.asc})}>Tipo {sortedBy.col==="tipo" ? (sortedBy.asc ? "▲":"▼"):""}</th>
            <th className="p-3 text-left cursor-pointer" onClick={()=>setSortedBy({col:"fecha",asc:!sortedBy.asc})}>Fecha {sortedBy.col==="fecha" ? (sortedBy.asc ? "▲":"▼"):""}</th>
            <th className="p-3 text-left cursor-pointer" onClick={()=>setSortedBy({col:"sku",asc:!sortedBy.asc})}>SKU {sortedBy.col==="sku" ? (sortedBy.asc ? "▲":"▼"):""}</th>
            <th className="p-3 text-right">Cajas (C)</th>
            <th className="p-3 text-right">Bandejas (B)</th>
            <th className="p-3 text-right">Unidades (U)</th>
            <th className="p-3 text-right cursor-pointer" onClick={()=>setSortedBy({col:"total",asc:!sortedBy.asc})}>Total {sortedBy.col==="total" ? (sortedBy.asc ? "▲":"▼"):""}</th>
            <th className="p-3 text-left cursor-pointer" onClick={()=>setSortedBy({col:"estado",asc:!sortedBy.asc})}>Estado {sortedBy.col==="estado" ? (sortedBy.asc ? "▲":"▼"):""}</th>
            <th className="p-3 text-left">Acción</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((m,i)=>
            <tr key={i} className="border-b hover:bg-gray-50">
              <td className="p-3 text-right">{m.id}</td>
              <td className="p-3">{m.tipo}</td>
              <td className="p-3">{m.fecha}</td>
              <td className="p-3">{m.sku}</td>
              <td className={`p-3 text-right ${parseInt(m.cajas)<0?"text-red-600 font-bold":""}`}>{m.cajas}</td>
              <td className={`p-3 text-right ${parseInt(m.bandejas)<0?"text-red-600 font-bold":""}`}>{m.bandejas}</td>
              <td className={`p-3 text-right ${parseInt(m.unidades)<0?"text-red-600 font-bold":""}`}>{m.unidades}</td>
              <td className={`p-3 text-right font-bold ${m.total<0?"text-red-600":""}`}>{m.total}</td>
              <td className="p-3">{m.estado}</td>
              <td className="p-3">
                <button className="bg-blue-600 px-4 py-1 text-white rounded" onClick={()=>window.location.href='/bodega'}>
                  Ver Detalle
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="flex justify-end mt-3">
        <button className="px-4 py-2 bg-blue-700 text-white rounded" onClick={()=>window.location.href='/reportes'}>Ver más movimientos</button>
      </div>
    </div>
  );
};
export default MovimientosTable;
