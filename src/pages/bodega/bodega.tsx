import { useState } from "react"
import MainLayout from "../../layouts/mainlayout"
import {
  FiPackage, FiCheckCircle, FiX, FiAlertTriangle, FiMinusCircle, FiDownload, FiUpload, FiPlusCircle, FiPlus, FiPrinter
} from "react-icons/fi"
import {
  SKUS,
  bodegamock,
  valespendientesmock,
  movimientosmock,
  Destino,
  TRANSPORTISTAS,
  getpabellonesactivos,
  Origen
} from "../../constants"
import type { BodegaStock, ValeBodega, MovimientoBodega } from "../../constants"
import ValesPackingTable from "../../components/table/vales-packing-table"
import StockTable from "../../components/table/stock-table"

const getSkuConMasStock = (stockArr: BodegaStock[]) => {
  if (stockArr.length === 0) return { sku: "---", totalunidades: 0 }
  return stockArr.reduce((max, curr) => curr.totalunidades > max.totalunidades ? curr : max, stockArr[0])
}
const hoy = new Date().toISOString().split("T")[0]

const BodegaPage = () => {
  const [stock, setStock] = useState<BodegaStock[]>(Array.isArray(bodegamock) ? bodegamock : [])
  const [valesPendientes, setValesPendientes] = useState<ValeBodega[]>(Array.isArray(valespendientesmock) ? valespendientesmock : [])
  const [movimientos, setMovimientos] = useState<MovimientoBodega[]>(Array.isArray(movimientosmock) ? movimientosmock : [])

  const [filtroFechaInicio, setFiltroFechaInicio] = useState("")
  const [filtroFechaFin, setFiltroFechaFin] = useState("")
  const [filtroSku, setFiltroSku] = useState("")
  const [filtroTipo, setFiltroTipo] = useState("todos")
  const [filtroEstado, setFiltroEstado] = useState("todos")
  const [ordenCol, setOrdenCol] = useState<string>("fecha")
  const [ordenAsc, setOrdenAsc] = useState<boolean>(true)
  const [detalleVale, setDetalleVale] = useState<ValeBodega | null>(null)
  const [detalleMovimiento, setDetalleMovimiento] = useState<MovimientoBodega | null>(null)
  const [showModalCrear, setShowModalCrear] = useState(false)
  const [showModalConfirmar, setShowModalConfirmar] = useState(false)
  const [tipoVale, setTipoVale] = useState("egreso")
  const [origen, setOrigen] = useState("")
  const [destino, setDestino] = useState("")
  const [transportista, setTransportista] = useState("")
  const [prodSku, setProdSku] = useState("")
  const [prodCajas, setProdCajas] = useState(0)
  const [prodBandejas, setProdBandejas] = useState(0)
  const [prodUnidades, setProdUnidades] = useState(0)
  const [productos, setProductos] = useState<any[]>([])
  const sumaTotal = productos.reduce((acc, p) => acc + (p.totalunidades || 0), 0)

  function agregarProducto() {
    const skuObj = SKUS.find(sk => sk.sku === prodSku)
    if (!skuObj) return
    const total = prodCajas * skuObj.unidadCaja + prodBandejas * skuObj.unidadBandeja + prodUnidades
    if (total === 0) return
    setProductos([
      ...productos,
      {
        sku: prodSku,
        cajas: prodCajas,
        bandejas: prodBandejas,
        unidades: prodUnidades,
        totalunidades: total
      }
    ])
    setProdSku("")
    setProdCajas(0)
    setProdBandejas(0)
    setProdUnidades(0)
  }

  function eliminarProducto(idx: number) {
    setProductos(productos.filter((_, i) => i !== idx))
  }

  function resetearFormularioVale() {
    setShowModalCrear(false)
    setTipoVale("egreso")
    setOrigen("")
    setDestino("")
    setTransportista("")
    setProductos([])
    setProdSku("")
    setProdCajas(0)
    setProdBandejas(0)
    setProdUnidades(0)
  }

  const origenSelectEnabled = tipoVale === "reingreso"
  const destinoSelectEnabled = tipoVale === "egreso"
  let origenReadonlyValue = ""
  let destinoReadonlyValue = ""
  let origenNombre = ""
  let destinoNombre = ""

  if (tipoVale === "ingreso") {
    origenReadonlyValue = "Packing"
    destinoReadonlyValue = "Bodega"
    origenNombre = "Packing"
    destinoNombre = "Bodega"
  }
  if (tipoVale === "egreso") {
    origenReadonlyValue = "Bodega"
    origenNombre = "Bodega"
    destinoNombre = destino
  }
  if (tipoVale === "reingreso") {
    destinoReadonlyValue = "Bodega"
    destinoNombre = "Bodega"
    origenNombre = Origen.find(o => o.id === Number(origen))?.nombre || ""
  }

  const formularioValido =
    tipoVale && (origenSelectEnabled ? origen : origenReadonlyValue) &&
    (destinoSelectEnabled ? destino : destinoReadonlyValue) &&
    productos.length > 0

  const totalStock = stock.reduce((acc, s) => acc + s.totalunidades, 0)
  const skuMaxStock = getSkuConMasStock(stock)
  const valesHoy = valesPendientes.filter(v => v.fecha === hoy).length
  const valesPendientesTotal = valesPendientes.length
  const egresosHoy = movimientos.filter(m => m.tipo === "egreso" && m.fecha === hoy).length
  const ingresosHoy = movimientos.filter(m => m.tipo === "ingreso" && m.fecha === hoy).length
  const reingresosHoy = movimientos.filter(m => m.tipo === "reingreso" && m.fecha === hoy).length
  const bajoStockSkus = stock.filter(s => s.totalunidades < 500).map(s => s.sku)
  const tipolist = Array.from(new Set(SKUS.map(s => s.tipo))).filter(Boolean)
  const ingresosRecientes = movimientos.filter(m => m.tipo === "ingreso").slice(-5)
  const egresosRecientes = movimientos.filter(m => m.tipo === "egreso").slice(-5)
  const reingresosRecientes = movimientos.filter(m => m.tipo === "reingreso").slice(-5)

  function confirmarValePendiente(v: ValeBodega) {
    if (!window.confirm("¿Deseas confirmar este vale?")) return
    setValesPendientes(valesPendientes.filter(val => val.id !== v.id))
    v.detalles.forEach(d => {
      setMovimientos(prev => [...prev, {
        id: Date.now() + Math.random(),
        fecha: hoy,
        tipo: "ingreso",
        sku: d.sku,
        cajas: d.cajas,
        bandejas: d.bandejas,
        unidades: d.unidades,
        totalunidades: d.totalunidades,
        estado: "validado"
      }])
    })
    setDetalleVale(null)
  }

  function rechazarValePendiente(v: ValeBodega) {
    if (!window.confirm("¿Rechazar este vale?")) return
    setValesPendientes(valesPendientes.filter(val => val.id !== v.id))
    setDetalleVale(null)
  }

  function handleConfirmarVale() {
    setShowModalConfirmar(true)
  }

  function confirmarValeDefinitivo() {
    if (tipoVale === "ingreso" || tipoVale === "reingreso") {
      setValesPendientes([
        ...valesPendientes,
        {
          id: Date.now(),
          fecha: hoy,
          operadorid: 0,
          operadornombre: "Bodega",
          detalles: productos,
          estado: "pendiente"
        }
      ])
    } else {
      productos.forEach(p => {
        setMovimientos(prev => [...prev, {
          id: Date.now() + Math.random(),
          fecha: hoy,
          tipo: "egreso",
          sku: p.sku,
          cajas: p.cajas,
          bandejas: p.bandejas,
          unidades: p.unidades,
          totalunidades: p.totalunidades,
          estado: "validado"
        }])
      })
    }
    setShowModalConfirmar(false)
    resetearFormularioVale()
  }

  function imprimirVale() {
    window.print()
  }

  const skusForTable = Array.isArray(stock) ? stock.map(s => ({
    sku: s.sku,
    nombre: s.nombre || s.sku,
    total: s.totalunidades || 0,
    c: s.cajas || 0,
    b: s.bandejas || 0,
    u: s.unidades || 0
  })) : []

  return (
    <MainLayout>
      <div className="p-6 space-y-8">
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Bodega</h1>
          <p className="text-gray-600 mb-6">Registro de movimiento de stock</p>
          <button
            onClick={() => setShowModalCrear(true)}
            className="flex items-center px-10 py-5 bg-blue-600 text-white rounded-2xl text-xl font-semibold shadow-lg hover:bg-blue-700 transition-all mb-2"
            style={{ minWidth: 260 }}
          >
            <FiPlus className="mr-3" size={32}/> nuevo vale
          </button>
        </div>

        {showModalCrear && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 relative">
              <button onClick={resetearFormularioVale} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
                <FiX size={32}/>
              </button>
              <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">
                <FiPlus className="mb-1" /> crear nuevo vale de {tipoVale}
              </h2>
              <div className="mb-5">
                <label className="block text-sm font-bold text-gray-700 mb-2">Tipo de vale</label>
                <select value={tipoVale} onChange={e => {setTipoVale(e.target.value);setOrigen("");setDestino("")}}
                  className="w-full px-3 py-2 border rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="ingreso">Ingreso</option>
                  <option value="egreso">Egreso</option>
                  <option value="reingreso">Reingreso</option>
                </select>
              </div>
              <div className="mb-5">
                <label className="block text-sm font-bold text-gray-700 mb-2">Origen</label>
                {tipoVale === "ingreso" && (
                  <input value="Packing" readOnly className="w-full px-3 py-2 border rounded-lg bg-gray-100 font-bold" />
                )}
                {tipoVale === "egreso" && (
                  <input value="Bodega" readOnly className="w-full px-3 py-2 border rounded-lg bg-gray-100 font-bold" />
                )}
                {tipoVale === "reingreso" && (
                  <select value={origen} onChange={e => setOrigen(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg">
                    <option value="">Seleccionar origen...</option>
                    {Origen.map(o => (
                      <option key={o.id} value={o.id}>{o.nombre}</option>
                    ))}
                  </select>
                )}
              </div>
              <div className="mb-5">
                <label className="block text-sm font-bold text-gray-700 mb-2">Destino</label>
                {tipoVale === "ingreso" && (
                  <input value="Bodega" readOnly className="w-full px-3 py-2 border rounded-lg bg-gray-100 font-bold" />
                )}
                {tipoVale === "egreso" && (
                  <select value={destino} onChange={e => setDestino(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg">
                    <option value="">Seleccionar destino...</option>
                    {Destino.map(d => (
                      <option key={d.id} value={d.nombre}>{d.nombre}</option>
                    ))}
                  </select>
                )}
                {tipoVale === "reingreso" && (
                  <input value="Bodega" readOnly className="w-full px-3 py-2 border rounded-lg bg-gray-100 font-bold" />
                )}
              </div>
              {tipoVale === "egreso" && (
                <div className="mb-5">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Transportista</label>
                  <select value={transportista} onChange={e => setTransportista(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg">
                    <option value="">Sin transportista</option>
                    {TRANSPORTISTAS.map(t => (
                      <option key={t.id} value={t.nombre}>{t.nombre} [{t.patente}]</option>
                    ))}
                  </select>
                </div>
              )}
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
                  )
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
                <button onClick={resetearFormularioVale}
                  className="bg-gray-200 px-4 py-2 rounded text-gray-700 hover:bg-gray-300">Cancelar</button>
                <button
                  disabled={!formularioValido}
                  onClick={() => handleConfirmarVale()}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-40"
                >
                  Confirmar vale
                </button>
              </div>
            </div>
          </div>
        )}

        {showModalConfirmar && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative">
              <button onClick={() => setShowModalConfirmar(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
                <FiX size={28}/>
              </button>
              <h2 className="text-xl font-bold mb-4 text-center text-blue-700">¿Confirmar vale?</h2>
              <div className="mb-4 text-sm space-y-1">
                <p><b>Tipo:</b> {tipoVale}</p>
                <p><b>Origen:</b> {origenNombre}</p>
                <p><b>Destino:</b> {destinoNombre}</p>
                <p className="mt-3 font-bold">Productos:</p>
                <ul className="list-disc ml-6">
                  {productos.map((p, idx) => (
                    <li key={idx}>{p.sku}: {p.totalunidades} u ({p.cajas}C, {p.bandejas}B, {p.unidades}U)</li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button onClick={imprimirVale} className="flex items-center gap-2 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">
                  <FiPrinter /> Imprimir
                </button>
                <button onClick={() => setShowModalConfirmar(false)} className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">Cancelar</button>
                <button onClick={confirmarValeDefinitivo} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700">Aceptar</button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
          <div className="rounded-lg shadow flex flex-col items-center p-4 bg-blue-50">
            <FiPackage size={28} className="mb-2 text-blue-800" />
            <div className="text-2xl font-bold text-blue-900">{totalStock.toLocaleString()}</div>
            <div className="text-md text-blue-900 font-medium">Stock total</div>
          </div>
          <div className="rounded-lg shadow flex flex-col items-center p-4 bg-indigo-50">
            <div className="text-sm text-indigo-600 font-semibold mb-1">SKU más stock</div>
            <div className="text-xl font-bold text-indigo-900">{skuMaxStock.sku}</div>
            <div className="text-md font-semibold text-indigo-800">{skuMaxStock.totalunidades.toLocaleString()} u</div>
          </div>
          <div className="rounded-lg shadow flex flex-col items-center p-4 bg-green-50">
            <FiCheckCircle size={28} className="mb-2 text-green-700" />
            <div className="text-xl font-bold text-green-900">{valesHoy}</div>
            <div className="text-md font-medium text-green-900">Vales generados HOY</div>
          </div>
          <div className="rounded-lg shadow flex flex-col items-center p-4 bg-red-50">
            <FiAlertTriangle size={28} className="mb-2 text-red-700" />
            <div className="text-xl font-bold text-red-900">{valesPendientesTotal}</div>
            <button className="text-md font-bold text-red-900 underline">
              Vales Pendientes
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
          <div className="rounded-lg shadow flex flex-col items-center p-4 bg-yellow-50">
            <FiDownload size={28} className="mb-2 text-yellow-800" />
            <div className="text-xl font-bold text-yellow-700">{ingresosHoy}</div>
            <div className="text-md text-yellow-800 font-medium">Ingresos hoy</div>
          </div>
          <div className="rounded-lg shadow flex flex-col items-center p-4 bg-purple-50">
            <FiUpload size={28} className="mb-2 text-purple-800" />
            <div className="text-xl font-bold text-purple-900">{egresosHoy}</div>
            <div className="text-md text-purple-900 font-medium">Egresos hoy</div>
          </div>
          <div className="rounded-lg shadow flex flex-col items-center p-4 bg-orange-50">
            <FiMinusCircle size={28} className="mb-2 text-orange-800" />
            <div className="text-xl font-bold text-orange-900">{reingresosHoy}</div>
            <div className="text-md text-orange-900 font-medium">Reingresos hoy</div>
          </div>
        </div>
        {bajoStockSkus.length > 0 && (
          <div className="flex items-center bg-red-50 border border-red-300 text-red-700 rounded-lg px-4 py-2 mb-2">
            <FiMinusCircle className="mr-2 text-red-800" size={22} />
            Stock mínimo en: <span className="ml-2 font-bold">{bajoStockSkus.join(", ")}</span>
          </div>
        )}

        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-lg text-gray-900">Vales pendientes</h3>
            <span className="inline-flex items-center px-3 py-1 text-sm bg-red-100 text-red-700 rounded-full font-semibold">{valesPendientesTotal}</span>
          </div>
          <ValesPackingTable
            vales={Array.isArray(valesPendientes) ? valesPendientes : []}
            ordenCol={ordenCol}
            setOrdenCol={setOrdenCol}
            ordenAsc={ordenAsc}
            setOrdenAsc={setOrdenAsc}
            filtroSku={filtroSku}
            filtroTipo={filtroTipo}
            filtroEstado={"pendiente"}
            onVerDetalle={setDetalleVale}
          />
        </div>
        {detalleVale && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow max-w-lg w-full relative min-w-[350px]">
              <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600" onClick={() => setDetalleVale(null)}>
                <FiX size={28} />
              </button>
              <h3 className="font-bold text-lg mb-3 text-blue-800">Detalle del Vale</h3>
              <div className="mb-2 text-sm">
                <b>Fecha:</b> {detalleVale.fecha}<br/>
                <b>Operador:</b> {detalleVale.operadornombre}<br/>
                <b>Estado:</b> {detalleVale.estado}<br/>
                <b>Productos:</b>
                <ul className="list-disc ml-6">
                  {detalleVale.detalles.map((d, idx) => (
                    <li key={idx}>{d.sku}: <b>{d.totalunidades}</b> u <span className="text-gray-500">({d.cajas}C, {d.bandejas}B, {d.unidades}U)</span></li>
                  ))}
                </ul>
                {detalleVale.observaciones && (
                  <div className="mt-2"><b>Obs:</b> {detalleVale.observaciones}</div>
                )}
              </div>
              <div className="flex justify-end gap-2 mt-8">
                <button onClick={() => confirmarValePendiente(detalleVale)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">Confirmar</button>
                <button onClick={() => rechazarValePendiente(detalleVale)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">Rechazar</button>
                <button onClick={() => setDetalleVale(null)} className="bg-gray-200 px-4 py-2 rounded">Cerrar</button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-lg text-gray-900">Stock en tiempo real</h3>
          </div>
          <StockTable skus={skusForTable} />
        </div>

        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <h3 className="font-semibold text-lg text-gray-900 mb-2">Cartola / Movimientos</h3>
          <ValesPackingTable
            vales={Array.isArray(movimientos) ? movimientos : []}
            ordenCol={ordenCol}
            setOrdenCol={setOrdenCol}
            ordenAsc={ordenAsc}
            setOrdenAsc={setOrdenAsc}
            filtroSku={filtroSku}
            filtroTipo={filtroTipo}
            filtroEstado={filtroEstado}
            onVerDetalle={setDetalleMovimiento}
          />
        </div>

        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <h3 className="font-semibold text-lg text-gray-900 mb-4">Ingresos Recientes</h3>
          <ValesPackingTable
            vales={Array.isArray(ingresosRecientes) ? ingresosRecientes : []}
            ordenCol={ordenCol}
            setOrdenCol={setOrdenCol}
            ordenAsc={ordenAsc}
            setOrdenAsc={setOrdenAsc}
            filtroSku={filtroSku}
            filtroTipo={filtroTipo}
            filtroEstado={filtroEstado}
            onVerDetalle={setDetalleMovimiento}
          />
        </div>
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <h3 className="font-semibold text-lg text-gray-900 mb-4">Egresos Recientes</h3>
          <ValesPackingTable
            vales={Array.isArray(egresosRecientes) ? egresosRecientes : []}
            ordenCol={ordenCol}
            setOrdenCol={setOrdenCol}
            ordenAsc={ordenAsc}
            setOrdenAsc={setOrdenAsc}
            filtroSku={filtroSku}
            filtroTipo={filtroTipo}
            filtroEstado={filtroEstado}
            onVerDetalle={setDetalleMovimiento}
          />
        </div>
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <h3 className="font-semibold text-lg text-gray-900 mb-4">Reingresos Recientes</h3>
          <ValesPackingTable
            vales={Array.isArray(reingresosRecientes) ? reingresosRecientes : []}
            ordenCol={ordenCol}
            setOrdenCol={setOrdenCol}
            ordenAsc={ordenAsc}
            setOrdenAsc={setOrdenAsc}
            filtroSku={filtroSku}
            filtroTipo={filtroTipo}
            filtroEstado={filtroEstado}
            onVerDetalle={setDetalleMovimiento}
          />
        </div>

        {detalleMovimiento && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow max-w-lg w-full relative">
              <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600" onClick={() => setDetalleMovimiento(null)}>
                <FiX size={28} />
              </button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}

export default BodegaPage
