import type { valeingresopacking } from "../../constants"
import { FiChevronDown, FiChevronUp } from "react-icons/fi"

type Props = {
  vales?: valeingresopacking[]; // Permite undefined, default a []
  onVerDetalle: (vale: valeingresopacking) => void;
  ordenCol: string;
  setOrdenCol: (col: string) => void;
  ordenAsc: boolean;
  setOrdenAsc: (asc: boolean) => void;
}

const estadoColor = (estado: string) =>
  estado === "validado" ? "bg-green-100 text-green-700"
  : estado === "pendiente" ? "bg-yellow-100 text-yellow-800"
  : estado === "rechazado" ? "bg-red-100 text-red-700"
  : estado === "anulado" ? "bg-gray-100 text-gray-500"
  : "bg-gray-50 text-gray-500"

const headerCell = (
  label: string,
  col: string,
  ordenCol: string,
  ordenAsc: boolean,
  setOrdenCol: (col: string) => void,
  setOrdenAsc: (asc: boolean) => void,
  align: string = "text-center"
) => (
  <th
    className={`px-3 py-2 text-xs font-bold text-gray-700 uppercase cursor-pointer select-none ${align}`}
    onClick={() => {
      if (ordenCol === col) setOrdenAsc(!ordenAsc)
      else { setOrdenCol(col); setOrdenAsc(false) }
    }}>
    <span className="flex items-center gap-1 justify-center">
      {label}
      {ordenCol === col && (ordenAsc ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />)}
    </span>
  </th>
)

const ValesPackingTable = ({
  vales = [],
  onVerDetalle,
  ordenCol,
  setOrdenCol,
  ordenAsc,
  setOrdenAsc
}: Props) => (
  <div className="bg-white rounded shadow overflow-x-auto">
    <table className="w-full text-base table-fixed">
      <colgroup>
        <col style={{ width: '8%' }} />
        <col style={{ width: '5%' }} />
        <col style={{ width: '10%' }} />
        <col style={{ width: '12%' }} />
        <col style={{ width: '10%' }} />
        <col style={{ width: '15%' }} />
        <col style={{ width: '10%' }} />
        <col style={{ width: '10%' }} />
      </colgroup>
      <thead className="bg-gray-50 text-xs uppercase">
        <tr>
          {headerCell("fecha", "fecha", ordenCol, ordenAsc, setOrdenCol, setOrdenAsc, "text-center")}
          {headerCell("id", "id", ordenCol, ordenAsc, setOrdenCol, setOrdenAsc, "text-center")}
          <th className="px-3 py-2 text-xs font-bold text-gray-700 uppercase text-center">tipo</th>
          <th className="px-3 py-2 text-xs font-bold text-gray-700 uppercase text-center">sku</th>
          <th className="px-3 py-2 text-xs font-bold text-gray-700 uppercase text-right">total</th>
          <th className="px-3 py-2 text-xs font-bold text-gray-700 uppercase text-center">desglose</th>
          {headerCell("estado", "estado", ordenCol, ordenAsc, setOrdenCol, setOrdenAsc, "text-center")}
          <th className="px-3 py-2 text-xs font-bold text-gray-700 uppercase text-center">acción</th>
        </tr>
      </thead>
      <tbody>
        {Array.isArray(vales) && vales.length > 0 ? (
          vales.map(vale =>
            vale.detalles && Array.isArray(vale.detalles) && vale.detalles.length > 0 ? (
              vale.detalles.map((prod, idx) =>
                <tr key={`${vale.id}-${prod.sku}-${idx}`} className="hover:bg-blue-50 transition">
                  {idx === 0 && (
                    <>
                      <td rowSpan={vale.detalles.length} className="px-3 py-2 align-middle text-center border-t font-mono text-sm">{vale.fecha}</td>
                      <td rowSpan={vale.detalles.length} className="px-3 py-2 align-middle text-center border-t">{vale.id}</td>
                      <td rowSpan={vale.detalles.length} className="px-3 py-2 align-middle text-center border-t">INGRESO</td>
                    </>
                  )}
                  <td className="px-3 py-2 border-t text-center align-middle">{prod.sku}</td>
                  <td className="px-3 py-2 border-t text-right font-semibold align-middle whitespace-nowrap">{prod.totalunidades?.toLocaleString()} <span className="text-xs">U</span></td>
                  <td className="px-3 py-2 border-t text-center align-middle whitespace-nowrap">{prod.cajas}C, {prod.bandejas}B, {prod.unidades}U</td>
                  {idx === 0 && (
                    <>
                      <td rowSpan={vale.detalles.length} className={`px-3 py-2 align-middle text-center border-t`}>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${estadoColor(vale.estado)}`}>{vale.estado}</span>
                      </td>
                      <td rowSpan={vale.detalles.length} className="px-3 py-2 align-middle text-center border-t">
                        <button
                          onClick={() => onVerDetalle(vale)}
                          className="text-blue-700 font-bold underline hover:text-blue-900 text-sm">VER MÁS</button>
                      </td>
                    </>
                  )}
                </tr>
              )
            ) : null
          )
        ) : (
          <tr>
            <td colSpan={8} className="px-3 py-4 text-center text-gray-500">No se encontraron vales</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
)

export default ValesPackingTable
