import { useState, useMemo } from "react"
import MainLayout from "../layouts/mainlayout"
import { FiCalendar, FiFilter, FiTrendingUp, FiAlertTriangle, FiDownload } from "react-icons/fi"
import { CONTADORES } from "../constants"

// Helper CSV
function exportCSV(data: any[], cols: string[], filename: string) {
  const csv = [cols.join(","), ...data.map(r => cols.map(c=>JSON.stringify(r[c]||"")).join(","))].join("\n")
  const blob = new Blob([csv], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}

const HistorialBalde = () => {
  const hoy = new Date().toISOString().split("T")[0]
  const [fechaInicio, setFechaInicio] = useState("")
  const [fechaFin, setFechaFin] = useState("")

  const historialMock = [
    { fecha: "22/10/2025", peso: 16.8, unidades: 280, operador: "Juan Pérez" },
    { fecha: "21/10/2025", peso: 16.5, unidades: 275, operador: "María López" },
    { fecha: "20/10/2025", peso: 13.2, unidades: 220, operador: "Juan Pérez" },
    { fecha: "19/10/2025", peso: 15.1, unidades: 252, operador: "Carlos Ruiz" },
    { fecha: "18/10/2025", peso: 14.8, unidades: 247, operador: "María López" },
  ]

  const faltaHoy = !historialMock.some(h => h.fecha === hoy)

  const filtered = useMemo(() => {
    return historialMock
      .filter(h => !fechaInicio || h.fecha >= fechaInicio)
      .filter(h => !fechaFin   || h.fecha <= fechaFin)
  }, [fechaInicio, fechaFin])

  const cols = ["fecha","peso","unidades","operador"]

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold">Historial Peso Balde (Merma)</h1>

        {faltaHoy && (
          <div className="flex items-center gap-2 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <FiAlertTriangle className="text-yellow-600" size={24}/>
            <span>Merma de hoy pendiente</span>
            <button
              onClick={()=>window.location.href="/produccion"}
              className="ml-auto text-blue-600 hover:underline"
            >Ir a producción</button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-yellow-50 rounded-xl shadow p-4 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <FiTrendingUp size={22} className="text-yellow-600"/>
              <span className="text-sm font-semibold text-gray-700">Promedio semanal</span>
            </div>
            <div className="text-2xl font-bold text-yellow-900">
              {(historialMock.reduce((a,b)=>a+b.peso,0)/historialMock.length).toFixed(2)} kg
            </div>
          </div>
          <div className="bg-orange-50 rounded-xl shadow p-4 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <FiTrendingUp size={22} className="text-orange-600"/>
              <span className="text-sm font-semibold text-gray-700">Total unidades semana</span>
            </div>
            <div className="text-2xl font-bold text-orange-900">
              {historialMock.reduce((a,b)=>a+b.unidades,0).toLocaleString()} U
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="flex items-center gap-2 text-gray-700 font-semibold mb-4">
            <FiFilter /> Filtros
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Fecha inicio</label>
              <input
                type="date"
                value={fechaInicio}
                onChange={e=>setFechaInicio(e.target.value)}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Fecha fin</label>
              <input
                type="date"
                value={fechaFin}
                onChange={e=>setFechaFin(e.target.value)}
                className="w-full border rounded px-2 py-1"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-gray-700 font-semibold">Registros históricos</h2>
            <button
              onClick={()=>exportCSV(filtered, cols, "merma.csv")}
              className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded"
            >
              <FiDownload /> Exportar CSV
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Fecha</th>
                  <th className="p-2 text-right">Peso (kg)</th>
                  <th className="p-2 text-right">Unidades</th>
                  <th className="p-2 text-left">Operador</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-gray-500">Sin datos</td>
                  </tr>
                ) : (
                  filtered.map((h,i)=>(
                    <tr key={i} className="border-b hover:bg-gray-50">
                      <td className="p-2">{h.fecha}</td>
                      <td className="p-2 text-right font-bold">{h.peso} kg</td>
                      <td className="p-2 text-right font-mono">{h.unidades} U</td>
                      <td className="p-2">{h.operador}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default HistorialBalde
