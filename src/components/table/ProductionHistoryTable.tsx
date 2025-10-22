import { useState } from "react"

// Mock de historial
const MOCK_HISTORIAL = [
  {
    fecha: "2025-10-21",
    pabellon: "13",
    pabellonero: "Juan Perez",
    C7: 100,
    C8: 200,
    C9: 150,
    C10: 175,
    C11: 160,
    C12: 180,
    total: 965,
    merma: 800 // g
  },
  {
    fecha: "2025-10-21",
    pabellon: "14",
    pabellonero: "Marcela Soto",
    C1: 150,
    C2: 180,
    C3: 170,
    C4: 165,
    C5: 160,
    C6: 150,
    total: 975,
    merma: 900
  }
  // ...más filas ...
]

const ALL_COLUMNS = [
  "fecha", "pabellon", "pabellonero",
  "contador1", "contador2", "contador3", "contador4", "contador5", "contador6",
  "total", "merma"
]

export default function ProductionHistoryTable({ historial = MOCK_HISTORIAL }) {
  const [desde, setDesde] = useState("")
  const [hasta, setHasta] = useState("")
  const [busqueda, setBusqueda] = useState("")
  const [ordenCol, setOrdenCol] = useState("fecha")
  const [ordenAsc, setOrdenAsc] = useState(true)

  // Filtrado y orden
  let datos = historial.filter(r => {
    const fd = new Date(desde || "2000-01-01")
    const fh = new Date(hasta || "2100-12-31")
    return (
      (!desde || new Date(r.fecha) >= fd) &&
      (!hasta || new Date(r.fecha) <= fh) &&
      (!busqueda || r.pabellon.includes(busqueda) || r.pabellonero.toLowerCase().includes(busqueda.toLowerCase()))
    )
  })

  datos = datos.sort((a,b)=>{
    if (a[ordenCol] < b[ordenCol]) return ordenAsc ? -1 : 1
    if (a[ordenCol] > b[ordenCol]) return ordenAsc ? 1 : -1
    return 0
  })

  // Exportar a CSV
  function exportarCSV() {
    const encabezado = Object.keys(datos[0]).join(",")
    const filas = datos.map(r => Object.values(r).join(",")).join("\n")
    const blob = new Blob([encabezado + "\n" + filas], {type:"text/csv"})
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "historial-produccion.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="w-full bg-white shadow rounded-xl p-6 my-2">
      <h3 className="text-xl font-bold mb-4 text-blue-900">Historial de registros de producción</h3>
      <div className="flex flex-wrap gap-3 items-end mb-3">
        <label className="text-xs font-semibold">Desde
          <input type="date" value={desde} onChange={e=>setDesde(e.target.value)} className="ml-1 border rounded px-2 py-1" />
        </label>
        <label className="text-xs font-semibold">Hasta
          <input type="date" value={hasta} onChange={e=>setHasta(e.target.value)} className="ml-1 border rounded px-2 py-1" />
        </label>
        <input
          type="text"
          placeholder="Buscar pabellón o pabellonero..."
          value={busqueda} onChange={e=>setBusqueda(e.target.value)}
          className="border rounded px-2 py-1 text-sm flex-1 min-w-[170px]" />
        <button className="ml-2 px-4 py-1 bg-green-700 text-white rounded font-bold" onClick={exportarCSV}>Exportar CSV</button>
      </div>
      <div className="overflow-auto">
        <table className="w-full text-xs text-left border rounded shadow">
          <thead>
            <tr>
              {Object.keys(datos[0] ?? {}).map(col => (
                <th
                  key={col}
                  onClick={()=> (setOrdenCol(col), setOrdenAsc(o => col===ordenCol ? !o : true))}
                  className="py-2 px-2 bg-gray-100 border-b cursor-pointer select-none hover:bg-blue-100"
                >
                  {col.toUpperCase()} {ordenCol===col && (ordenAsc ? "↑":"↓")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {datos.map((r,i) =>
              <tr key={i} className="border-b">
                {Object.keys(r).map((col,j) =>
                  <td key={col} className="py-1 px-2">{col==="merma" ? `${r[col]} g` : r[col]}</td>
                )}
              </tr>
            )}
            {!datos.length && (
              <tr><td className="text-center py-8 text-gray-500" colSpan={ALL_COLUMNS.length}>Sin datos</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
