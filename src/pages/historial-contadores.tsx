import { useState, useMemo } from "react"
import MainLayout from "../layouts/mainlayout"
import { FiCalendar, FiFilter, FiAlertTriangle, FiDownload } from "react-icons/fi"
import { CONTADORES, PABELLONES } from "../constants"

// Helper para exportar CSV
function exportCSV(data: any[], columns: string[], filename: string) {
  const csv = [
    columns.join(","), 
    ...data.map(row => columns.map(col => JSON.stringify(row[col] ?? "")).join(","))
  ].join("\n")
  const blob = new Blob([csv], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

const HistorialContadores = () => {
  const hoy = new Date().toISOString().split("T")[0]
  const [fechaInicio, setFechaInicio] = useState("")
  const [fechaFin, setFechaFin] = useState("")
  const [pabellonFiltro, setPabellonFiltro] = useState("todos")
  const [lineaFiltro, setLineaFiltro] = useState("todos")
  const [caraFiltro, setCaraFiltro] = useState("todos")
  const [sortCol, setSortCol] = useState<keyof typeof CONTADORES[0]>("fecha")
  const [sortAsc, setSortAsc] = useState(true)

  const historialMock = CONTADORES.map(c => ({
    fecha: c.fecha,
    pabellon: c.pabellon,
    contador: `C${c.id}`,
    valor: c.valor ?? 0,
    linea: c.linea,
    cara: c.cara
  }))

  const faltanHoy = !CONTADORES.some(c => c.fecha === hoy)

  const filtered = useMemo(() => {
    return historialMock
      .filter(h => !fechaInicio || h.fecha >= fechaInicio)
      .filter(h => !fechaFin   || h.fecha <= fechaFin)
      .filter(h => pabellonFiltro === "todos" || h.pabellon === pabellonFiltro)
      .filter(h => lineaFiltro   === "todos" || h.linea   === lineaFiltro)
      .filter(h => caraFiltro    === "todos" || String(h.cara) === caraFiltro)
      .sort((a, b) => {
        const vA = a[sortCol] as any
        const vB = b[sortCol] as any
        if (vA == null) return 1
        if (vB == null) return -1
        if (vA === vB) return 0
        if (sortAsc) return vA < vB ? -1 : 1
        return vA > vB ? -1 : 1
      })
  }, [fechaInicio, fechaFin, pabellonFiltro, lineaFiltro, caraFiltro, sortCol, sortAsc])

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold">Historial de Contadores</h1>

        {faltanHoy && (
          <div className="flex items-center gap-2 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <FiAlertTriangle className="text-yellow-600" size={24}/>
            <span>No se ingresaron contadores hoy.</span>
            <button
              onClick={() => window.location.href = "/produccion"}
              className="ml-auto text-blue-600 hover:underline"
            >
              Ir a producción
            </button>
          </div>
        )}

        <div className="bg-white p-6 rounded shadow space-y-4">
          <h2 className="flex items-center gap-2 font-semibold text-gray-700"><FiFilter/> Filtros</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm">Fecha inicio</label>
              <input type="date" value={fechaInicio} onChange={e=>setFechaInicio(e.target.value)}
                className="w-full border rounded px-2 py-1"/>
            </div>
            <div>
              <label className="block text-sm">Fecha fin</label>
              <input type="date" value={fechaFin} onChange={e=>setFechaFin(e.target.value)}
                className="w-full border rounded px-2 py-1"/>
            </div>
            <div>
              <label className="block text-sm">Pabellón</label>
              <select value={pabellonFiltro} onChange={e=>setPabellonFiltro(e.target.value)}
                className="w-full border rounded px-2 py-1">
                <option value="todos">Todos</option>
                {PABELLONES.map(p=>(
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm">Línea</label>
              <select value={lineaFiltro} onChange={e=>setLineaFiltro(e.target.value)}
                className="w-full border rounded px-2 py-1">
                <option value="todos">Todos</option>
                {Array.from(new Set(CONTADORES.map(c=>c.linea))).map(l=>(
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm">Cara</label>
              <select value={caraFiltro} onChange={e=>setCaraFiltro(e.target.value)}
                className="w-full border rounded px-2 py-1">
                <option value="todos">Todos</option>
                {Array.from(new Set(CONTADORES.map(c=>String(c.cara)))).map(ca=>(
                  <option key={ca} value={ca}>{ca}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Registros</h2>
            <button
              onClick={()=>exportCSV(filtered, ["fecha","pabellon","contador","linea","cara","valor"], "contadores.csv")}
              className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded"
            >
              <FiDownload /> Exportar CSV
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  {["fecha","pabellon","contador","linea","cara","valor"].map(col=>(
                    <th key={col} className="p-2 text-left cursor-pointer"
                      onClick={()=> {
                        setSortCol(col as any)
                        setSortAsc(sortCol===col ? !sortAsc : true)
                      }}
                    >
                      {col.charAt(0).toUpperCase()+col.slice(1)}
                      {sortCol===col && (sortAsc ? " ▲":" ▼")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length===0?(
                  <tr><td colSpan={6} className="p-4 text-center">Sin datos</td></tr>
                ):filtered.map((h,idx)=>(
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="p-2">{h.fecha}</td>
                    <td className="p-2">{h.pabellon}</td>
                    <td className="p-2 font-bold">{h.contador}</td>
                    <td className="p-2">{h.linea}</td>
                    <td className="p-2">{h.cara}</td>
                    <td className="p-2 text-right">{(h.valor ?? 0).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default HistorialContadores
