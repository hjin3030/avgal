import { useState } from "react"
import MainLayout from "../../layouts/mainlayout"
import ValesPackingTable from "../../components/table/vales-packing-table"
import {
  FiPackage, FiCheckCircle, FiClock, FiTrendingUp,
  FiX, FiPlus, FiAlertTriangle, FiDownload
} from "react-icons/fi"
import type { valeingresopacking } from "../../constants"
import { valespackingmock, getpabellonesactivos, SKUS, CONTADORES } from "../../constants"

const packing = () => {
  const [vales, setVales] = useState<valeingresopacking[]>(valespackingmock)
  const [filtroFechaInicio, setFiltroFechaInicio] = useState("")
  const [filtroFechaFin, setFiltroFechaFin] = useState("")
  const [filtroSku, setFiltroSku] = useState("")
  const [filtroTipoVale, setFiltroTipoVale] = useState("todos")
  const [filtroEstado, setFiltroEstado] = useState("todos")
  const [seleccion, setSeleccion] = useState<valeingresopacking | null>(null)
  const [showModalCrear, setShowModalCrear] = useState(false)
  const [showResumen, setShowResumen] = useState(false)
  const [ordenCol, setOrdenCol] = useState("fecha")
  const [ordenAsc, setOrdenAsc] = useState<boolean>(false)

  const hoy = new Date().toISOString().split("T")[0]

  const faltanContadoresHoy = !CONTADORES.some(c => c.fecha === hoy)

  let valesFiltrados = vales.filter((v) => {
    if (filtroFechaInicio && v.fecha < filtroFechaInicio) return false
    if (filtroFechaFin && v.fecha > filtroFechaFin) return false
    if (filtroEstado !== "todos" && v.estado !== filtroEstado) return false
    if (filtroSku) {
      const skuMatch = v.detalles.some(det => det.sku.toLowerCase().includes(filtroSku.toLowerCase()))
      if (!skuMatch) return false
    }
    return true
  })

  valesFiltrados = [...valesFiltrados].sort((a, b) => {
    let res = 0
    if (ordenCol === "fecha") res = a.fecha.localeCompare(b.fecha)
    if (ordenCol === "id") res = a.id - b.id
    if (ordenCol === "estado") res = a.estado.localeCompare(b.estado)
    if (ordenCol === "sku") {
      const as = (a.detalles[0]?.sku || "")
      const bs = (b.detalles[0]?.sku || "")
      res = as.localeCompare(bs)
    }
    if (ordenCol === "total") res = (a.totalunidadesempaquetadas || 0) - (b.totalunidadesempaquetadas || 0)
    if (!ordenAsc) res *= -1
    return res
  })

  const valesHoy = vales.filter((v) => v.fecha === hoy)
  const totalhoy = valesHoy.reduce((sum, v) => sum + (v.totalunidadesempaquetadas || 0), 0)
  const valesval = valesHoy.filter((v) => v.estado === "validado").length
  const valespen = valesHoy.filter((v) => v.estado === "pendiente").length
  const valesrech = valesHoy.filter((v) => v.estado === "rechazado").length
  const totalHoyVales = valesval + valespen + valesrech
  const porcVal = totalHoyVales > 0 ? Math.round((valesval / totalHoyVales) * 100) : 0
  const porcPen = totalHoyVales > 0 ? Math.round((valespen / totalHoyVales) * 100) : 0
  const porcRech = totalHoyVales > 0 ? Math.round((valesrech / totalHoyVales) * 100) : 0

  const getDayName = (fecha: string) => {
    const dias = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"]
    const d = new Date(fecha)
    return dias[d.getDay()]
  }

  const [nuevoPabellon, setNuevoPabellon] = useState("")
  const [prodSku, setProdSku] = useState("")
  const [prodCajas, setProdCajas] = useState<number>(0)
  const [prodBandejas, setProdBandejas] = useState<number>(0)
  const [prodUnidades, setProdUnidades] = useState<number>(0)
  const [productos, setProductos] = useState<any[]>([])

  const limpiarIngreso = () => {
    setProdSku(""); setProdCajas(0); setProdBandejas(0); setProdUnidades(0)
  }
  const agregarProducto = () => {
    if (!prodSku || (prodCajas === 0 && prodBandejas === 0 && prodUnidades === 0)) return
    const skuObj = SKUS.find(sk => sk.sku === prodSku)
    if (!skuObj) return
    const total = prodCajas * skuObj.unidadCaja + prodBandejas * skuObj.unidadBandeja + prodUnidades
    setProductos([...productos, {
      sku: prodSku,
      cajas: prodCajas,
      bandejas: prodBandejas,
      unidades: prodUnidades,
      totalunidades: total
    }])
    limpiarIngreso()
  }
  const eliminarProducto = idx => setProductos([...productos.filter((_, i) => i !== idx)])
  const sumaTotal = productos.reduce((a, p) => a + p.totalunidades, 0)
  const formularioValido = nuevoPabellon && productos.length > 0

  const pabellonData = getpabellonesactivos().find(p => p.id === nuevoPabellon)

  function exportPDF() {
    const content = `
VALE DE INGRESO #${seleccion?.id || "NUEVO"}
${getDayName(seleccion?.fechacreacion || hoy)}, ${new Date(seleccion?.fechacreacion || hoy).toLocaleDateString("es-CL")} ${new Date(seleccion?.fechacreacion || hoy).toLocaleTimeString("es-CL")}

Origen: packing
Pabellón: ${seleccion?.pabellonnombre || pabellonData?.nombre}
Destino: bodega
Estado: ${seleccion?.estado || "pendiente"}

PRODUCTOS EMPAQUETADOS:
${(seleccion?.detalles || productos).map(d => `${d.sku}: ${d.totalunidades} U (${d.cajas}C, ${d.bandejas}B, ${d.unidades}U)`).join("\n")}

Total: ${(seleccion?.totalunidadesempaquetadas || sumaTotal)} U
    `
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `vale-${seleccion?.id || "nuevo"}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const modaldetalle = (valeData?: any) => {
    const data = valeData || seleccion
    if (!data) return null
    const fechaIso = data.fechacreacion ?? data.fecha ?? hoy
    const fechaObj = new Date(fechaIso)
    const diaSemana = getDayName(fechaIso)
    const fechaHora = `${diaSemana}, ${fechaObj.toLocaleDateString("es-CL")}, ${fechaObj.toLocaleTimeString("es-CL")}`

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                VALE DE INGRESO {data.id ? '#' + data.id : ''}
              </h2>
              <button onClick={() => {setSeleccion(null); setShowResumen(false)}} className="text-gray-400 hover:text-gray-600"><FiX size={24} /></button>
            </div>
            <div className="text-gray-700 text-sm">{fechaHora}</div>
            <div className="flex flex-wrap gap-4 mt-2">
              <div><span className="text-gray-400">Origen:</span> packing</div>
              <div><span className="text-gray-400">Pab:</span> {data.pabellonnombre || pabellonData?.nombre}</div>
              <div><span className="text-gray-400">Destino:</span> bodega</div>
              <div><span className="text-gray-400">Estado:</span> <span className="capitalize">{data.estado || "pendiente"}</span></div>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <h3 className="text-lg font-semibold mb-3">productos empaquetados</h3>
            <div className="overflow-x-auto border rounded">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase">SKU</th>
                    <th className="px-4 py-2 text-right text-xs font-bold text-gray-700 uppercase">TOTAL</th>
                    <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase">DESGLOSE</th>
                  </tr>
                </thead>
                <tbody>
                  {data.detalles.map((d, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium">{d.sku}</td>
                      <td className="px-4 py-2 text-right whitespace-nowrap">{d.totalunidades.toLocaleString()} U</td>
                      <td className="px-4 py-2">{`${d.cajas}C, ${d.bandejas}B, ${d.unidades}U`}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50 border-t">
                    <td className="px-4 py-2 text-right font-bold">Total:</td>
                    <td className="px-4 py-2 font-bold text-green-700">{data.totalunidadesempaquetadas?.toLocaleString() || sumaTotal.toLocaleString()} U</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex flex-row-reverse gap-2">
            {!data.id && (
              <>
                <button onClick={() => { setShowResumen(false); setShowModalCrear(false); setProductos([]); setNuevoPabellon("");}}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700">Confirmar y guardar</button>
                <button onClick={() => setShowResumen(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Volver y editar</button>
              </>
            )}
            {data.id && (
              <>
                <button onClick={exportPDF}
                  className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  <FiDownload /> Exportar PDF
                </button>
                <button onClick={() => setSeleccion(null)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Cerrar</button>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <MainLayout>
      <div className="p-6 space-y-8">
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Packing</h1>
          <p className="text-gray-600 mb-6">vales de ingreso desde packing a bodega</p>
          <button
            onClick={() => setShowModalCrear(true)}
            className="flex items-center px-10 py-5 bg-blue-600 text-white rounded-2xl text-xl font-semibold shadow-lg hover:bg-blue-700 transition-all mb-2"
            style={{ minWidth: 260 }}
          >
            <FiPlus className="mr-3" size={32}/> nuevo vale
          </button>
        </div>

        {faltanContadoresHoy && (
          <div className="flex items-center gap-2 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <FiAlertTriangle className="text-yellow-600" size={24}/>
            <span>Contadores y merma de hoy no ingresados.</span>
            <button
              onClick={() => window.location.href = "/produccion"}
              className="ml-auto text-blue-600 hover:underline"
            >Ir a producción</button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
          <div className="rounded-lg shadow flex flex-col items-center p-4 bg-blue-50">
            <FiPackage size={28} className="mb-1 text-blue-700" />
            <div className="text-2xl font-bold text-blue-900">{totalhoy.toLocaleString()}</div>
            <div className="text-md text-blue-900 font-medium">Total unidades empaquetado hoy</div>
          </div>
          <div className="rounded-lg shadow flex flex-col p-4 bg-green-50">
            <div className="text-lg font-bold text-green-900 mb-2">Vales generados: {totalHoyVales}</div>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="text-center">
                <div className="font-bold text-green-700">{valesval}</div>
                <div className="text-xs text-green-600">{porcVal}% Confirmados</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-yellow-700">{valespen}</div>
                <div className="text-xs text-yellow-600">{porcPen}% Pendientes</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-red-700">{valesrech}</div>
                <div className="text-xs text-red-600">{porcRech}% Rechazados</div>
              </div>
            </div>
          </div>
        </div>

        {valespen > 0 && (
          <div className="flex items-center bg-red-100 text-red-900 border border-red-400 rounded-lg px-4 py-2 mb-4 shadow">
            <FiAlertTriangle className="mr-2 text-red-700" size={22} />
            <span className="mx-1 font-bold">¡ATENCIÓN! Hay {valespen} vale(s) pendiente(s) de validación.</span>
          </div>
        )}

        <div className="bg-white p-4 rounded-lg shadow space-y-4">
          <h3 className="font-semibold text-gray-900">filtros</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha inicio</label>
              <input type="date" value={filtroFechaInicio}
                  onChange={e => setFiltroFechaInicio(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha fin</label>
              <input type="date" value={filtroFechaFin}
                  onChange={e => setFiltroFechaFin(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
              <input type="text" placeholder="Buscar SKU..." value={filtroSku}
                  onChange={e => setFiltroSku(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de vale</label>
              <select value={filtroTipoVale} onChange={e => setFiltroTipoVale(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="todos">Todos</option>
                <option value="ingreso">Ingreso</option>
                <option value="egreso">Egreso</option>
                <option value="reingreso">Reingreso</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="todos">todos</option>
                <option value="pendiente">pendiente</option>
                <option value="validado">validado</option>
                <option value="rechazado">rechazado</option>
                <option value="anulado">anulado</option>
              </select>
            </div>
          </div>
          {(filtroFechaInicio || filtroFechaFin || filtroTipoVale !== "todos" || filtroEstado !== "todos" || filtroSku) && (
            <button onClick={() => {
                setFiltroFechaInicio("");
                setFiltroFechaFin("");
                setFiltroTipoVale("todos");
                setFiltroEstado("todos");
                setFiltroSku("");
              }} className="text-sm text-blue-600 hover:text-blue-700 mt-2">limpiar filtros</button>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-3">Vales</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  {["id", "fecha", "sku", "total", "estado"].map(col => (
                    <th key={col} className="p-2 text-left cursor-pointer" onClick={() => {setSortCol(col); setSortAsc(ordenCol === col ? !ordenAsc : true)}}>
                      {col.toUpperCase()} {ordenCol === col && (ordenAsc ? "▲" : "▼")}
                    </th>
                  ))}
                  <th className="p-2">Acción</th>
                </tr>
              </thead>
              <tbody>
                {valesFiltrados.length === 0 ? (
                  <tr><td colSpan={6} className="p-4 text-center">Sin datos</td></tr>
                ) : (
                  valesFiltrados.map(v => (
                    <tr key={v.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">{v.id}</td>
                      <td className="p-2">{v.fecha}</td>
                      <td className="p-2">{v.detalles.map(d => d.sku).join(", ")}</td>
                      <td className="p-2">{v.totalunidadesempaquetadas?.toLocaleString() || 0} U</td>
                      <td className="p-2"><span className={`px-2 py-1 rounded text-xs font-bold ${v.estado === "validado" ? "bg-green-100 text-green-700" : v.estado === "pendiente" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>{v.estado}</span></td>
                      <td className="p-2"><button onClick={() => setSeleccion(v)} className="text-blue-600 hover:underline text-xs">Ver</button></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModalCrear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 relative">
            <button onClick={() => setShowModalCrear(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
              <FiX size={32}/>
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center text-blue-700"><FiPlus className="mb-1" /> crear nuevo vale de ingreso</h2>
            <div className="mb-5">
              <label className="block text-sm font-bold text-gray-700 mb-2">Pabellón</label>
              <select value={nuevoPabellon} onChange={e => setNuevoPabellon(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={productos.length > 0}>
                <option value="">Seleccionar pabellón</option>
                {getpabellonesactivos().map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
              </select>
              {productos.length > 0 && (
                <div className="ml-1 text-xs text-blue-700 font-bold">El vale queda asociado a: {pabellonData?.nombre}</div>
              )}
            </div>
            <div className="mb-5 space-y-2">
              <label className="block text-sm font-bold text-blue-900 mb-1">Agregar producto/s al vale</label>
              <div className="flex gap-2 mb-1 items-end">
                <select value={prodSku} onChange={e => setProdSku(e.target.value)}
                  className="w-44 px-2 py-2 border rounded focus:ring-blue-500" >
                  <option value="">SKU</option>
                  {SKUS.map(sk => (
                    <option value={sk.sku} key={sk.sku}>{sk.sku} - {sk.nombre}</option>
                  ))}
                </select>
                <div className="flex flex-col items-center">
                  <span className="mb-1 font-semibold text-xs text-blue-900">C</span>
                  <input type="number" placeholder="Cajas" min={0} value={prodCajas}
                    onChange={e => setProdCajas(Number(e.target.value))} className="w-20 px-2 py-2 border rounded text-center" />
                </div>
                <div className="flex flex-col items-center">
                  <span className="mb-1 font-semibold text-xs text-blue-900">B</span>
                  <input type="number" placeholder="Bandejas" min={0} value={prodBandejas}
                    onChange={e => setProdBandejas(Number(e.target.value))} className="w-20 px-2 py-2 border rounded text-center" />
                </div>
                <div className="flex flex-col items-center">
                  <span className="mb-1 font-semibold text-xs text-blue-900">U</span>
                  <input type="number" placeholder="Unidades" min={0} value={prodUnidades}
                    onChange={e => setProdUnidades(Number(e.target.value))} className="w-20 px-2 py-2 border rounded text-center" />
                </div>
                <button disabled={!prodSku || (prodCajas === 0 && prodBandejas === 0 && prodUnidades === 0)}
                  onClick={agregarProducto}
                  className="px-3 py-2 bg-green-500 text-white rounded disabled:opacity-50 font-bold w-24 h-[42px]">Agregar</button>
              </div>
              <div className="ml-2 text-sm text-gray-600">Total: <span className="font-bold">{(() => {
                const skuObj = SKUS.find(sk => sk.sku === prodSku)
                if (!skuObj) return "0"
                return (
                  prodCajas * skuObj.unidadCaja +
                  prodBandejas * skuObj.unidadBandeja +
                  prodUnidades
                ).toLocaleString()
              })()} unidades</span></div>
            </div>
            {productos.length > 0 && (
              <div className="mb-2">
                <table className="w-full text-sm border rounded">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-2 py-2 text-center">SKU</th>
                      <th className="px-2 py-2 text-right">TOTAL</th>
                      <th className="px-2 py-2 text-center">DESGLOSE</th>
                      <th className="px-2 py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {productos.map((p, idx) => (
                      <tr key={idx}>
                        <td className="px-2 py-2 text-center">{p.sku}</td>
                        <td className="px-2 py-2 text-right text-blue-900 font-bold">{p.totalunidades.toLocaleString()}</td>
                        <td className="px-2 py-2 text-center">{p.cajas}C, {p.bandejas}B, {p.unidades}U</td>
                        <td className="px-2 py-2 text-right"><button onClick={() => eliminarProducto(idx)} className="text-red-600 hover:underline">Eliminar</button></td>
                      </tr>
                    ))}
                    <tr className="bg-gray-100 font-bold">
                      <td className="px-2 py-2 text-right">TOTAL:</td>
                      <td className="px-2 py-2 text-right">{sumaTotal.toLocaleString()}</td>
                      <td colSpan={2}></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
            <div className="flex justify-between mt-6 mb-2">
              <button onClick={() => { setProductos([]); setNuevoPabellon(""); setShowModalCrear(false) }}
                className="bg-gray-200 px-4 py-2 rounded text-gray-700 hover:bg-gray-300">Cancelar</button>
              <button
                disabled={!formularioValido}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-40"
                onClick={() => setShowResumen(true)}
              >
                Confirmar vale
              </button>
            </div>
          </div>
        </div>
      )}
      {showResumen &&
        modaldetalle({
          pabellonnombre: pabellonData?.nombre || "",
          detalles: productos,
          totalunidadesempaquetadas: sumaTotal,
          estado: "pendiente"
        })
      }
      {seleccion && modaldetalle()}
    </MainLayout>
  )
}

export default packing
