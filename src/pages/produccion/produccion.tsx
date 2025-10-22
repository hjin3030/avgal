import { useState, useEffect } from "react"
import MainLayout from "../../layouts/mainlayout"
import { CONTADORES, PABELLONEROS } from "../../constants"
import ProductionHistoryTable from "../../components/table/ProductionHistoryTable"

const PABELLON_IDS = ["13", "14", "15"]

const today = new Date().toISOString().split("T")[0]

const ProduccionPage = () => {
  const [inputs, setInputs] = useState<{[k:string]: number | ""}>({})
  const [confirmados, setConfirmados] = useState<{[pid:string]: boolean}>({})
  const [merma, setMerma] = useState<number | "">("")
  const [mermaConfirmada, setMermaConfirmada] = useState(false)
  const [fechaUltReset, setFechaUltReset] = useState(today)
  const [verHistorial, setVerHistorial] = useState(false)

  // Reset automático
  useEffect(() => {
    const interval = setInterval(() => {
      const iso = new Date().toISOString().split("T")[0]
      if (fechaUltReset !== iso) {
        setInputs({})
        setConfirmados({})
        setMerma("")
        setMermaConfirmada(false)
        setFechaUltReset(iso)
      }
    }, 60000)
    return () => clearInterval(interval)
  }, [fechaUltReset])



  
  // Lógica de agrupación y helpers
  function getContadoresPorPabellon(pid: string) {
    return CONTADORES.filter(c => c.pabellon === pid)
  }
  function getLineaCorta(contador:any) {
    return contador.linea + contador.cara
  }
  function pabellonCompleto(pid:string) {
    const cs = getContadoresPorPabellon(pid)
    return cs.every(c => typeof inputs[`${today}-${pid}-${c.id}`] === "number" && Number(inputs[`${today}-${pid}-${c.id}`]) >= 1)
  }
  function handleChange(pid:string, cid:number, val:string) {
    if (!val) setInputs({ ...inputs, [`${today}-${pid}-${cid}`]: "" })
    else setInputs({ ...inputs, [`${today}-${pid}-${cid}`]: Math.max(1, Number(val)) })
  }
  function getResumen(pid: string) {
    return getContadoresPorPabellon(pid).reduce((s,c) => {
      const val = Number(inputs[`${today}-${pid}-${c.id}`])
      return s + (isNaN(val) ? 0 : val)
    }, 0)
  }
  function getPabelloneroNombre(pid:string) {
    const found = PABELLONEROS.find(p => p.pabellon === pid)
    return found ? found.nombre : "-"
  }
  // Info para merma
  const huevoEstimado = merma !== "" && Number(merma) > 0 ? Math.round(Number(merma)/60) : 0
  const kgMerma = merma !== "" && Number(merma) > 0 ? (Number(merma)/1000).toFixed(2) : "0.00"


  

  // Responsive, distribuido a todo el ancho
  return (
    <MainLayout>

      
      <div className="p-4 md:p-8 w-full">
        <h1 className="font-black text-2xl md:text-3xl text-gray-900 mb-6 text-left tracking-tight">
          Producción: Contadores y Estado de Pabellones
        </h1>
    

        {/* Merma del día */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 items-center w-full max-w-2xl mb-10">
          <label className="font-bold text-gray-700 text-md md:text-lg">
            Merma general del día (g):
            <span className="text-gray-500 font-normal text-sm ml-2">(Ej: si ingresas 600 equivale a 0.6kg)</span>
          </label>
          <div className="flex items-center gap-4">
            <input
              type="number"
              inputMode="numeric"
              min={0}
              step={1}
              className="border border-gray-300 px-3 py-1 rounded w-32 text-center font-semibold text-lg"
              value={merma !== "" ? merma : ""}
              disabled={mermaConfirmada}
              onChange={e => setMerma(Math.max(0, Number(e.target.value)))}
              placeholder="0"
            />
            <button
              className="bg-green-600 px-5 py-2 rounded text-white font-bold shadow border-green-700 border-2 text-base disabled:opacity-60 transition"
              disabled={mermaConfirmada || merma === "" || Number(merma) < 0}
              onClick={() => setMermaConfirmada(true)}
            >
              Confirmar merma diaria
            </button>
            <div className="flex flex-col">
              <span className="text-gray-500 text-xs">Kg: <span className="font-bold">{kgMerma}</span></span>
              <span className="text-gray-500 text-xs">Huevos estimados: <span className="font-bold">{huevoEstimado}</span></span>
            </div>
            {mermaConfirmada &&
              <span className="ml-2 px-3 py-1 rounded bg-green-100 text-green-700 font-bold text-sm border border-green-200">¡Merma registrada!</span>
            }
          </div>
        </div>

        {/* Sección pabellones */}
        <h3 className="text-lg md:text-xl font-bold mb-3 text-blue-900">
          Input diario de contadores por pabellón
        </h3>

        <div className="flex flex-col gap-y-8">
          {PABELLON_IDS.map(pid=>{
            const contadores = getContadoresPorPabellon(pid)
            const completed = !!confirmados[pid]
            const pabellonero = getPabelloneroNombre(pid)
            return (
              <div
                key={pid}
                className="w-full bg-white rounded-xl shadow border px-6 py-5 flex flex-col gap-4"
              >
                <div className="flex justify-between items-center flex-wrap pb-2 border-b">
                  <span className="font-extrabold text-xl md:text-2xl tracking-widest text-blue-700">
                    PABELLÓN {pid}
                    <span className="ml-2 text-gray-700 text-base font-black tracking-normal font-sans">
                      (Pabellonero: <span className="font-bold">{pabellonero}</span>)
                    </span>
                  </span>
                  {completed
                    ? <span className="px-4 py-1 rounded bg-green-100 text-green-700 font-bold border border-green-200 text-sm">Registro confirmado</span>
                    : <span className="px-4 py-1 rounded bg-yellow-100 text-yellow-900 font-bold border border-yellow-300 animate-pulse text-sm">Pendiente registro</span>
                  }
                </div>
                <div className="w-full grid grid-cols-2 md:grid-cols-7 gap-x-4 gap-y-5 place-items-center pt-3">
                  {contadores.map(cont => {
                    const key = `${today}-${pid}-${cont.id}`
                    return (
                      <div key={cont.id} className="bg-gray-50 shadow flex flex-col items-center justify-center px-3 py-2 rounded-lg min-w-[80px] border border-gray-200">
                        <span className="font-extrabold text-base text-blue-900 mb-1">{cont.nombre}</span>
                        <span className="font-bold text-gray-700 text-xs mb-2">{getLineaCorta(cont)}</span>
                        <input
                          type="number"
                          inputMode="numeric"
                          min={1}
                          placeholder="0"
                          className={`mb-1 border border-gray-300 rounded px-2 py-1 w-16 text-center font-mono text-base transition ${inputs[key] ? "font-bold text-blue-900 bg-blue-50" : ""}`}
                          value={inputs[key] !== undefined ? inputs[key] : ""}
                          disabled={completed}
                          onChange={e => handleChange(pid, cont.id, e.target.value)}
                        />
                        {inputs[key] && Number(inputs[key]) > 0
                          ? <span className="text-xs text-green-700 font-bold">Ingresado</span>
                          : <span className="text-xs text-yellow-800">Pendiente</span>}
                      </div>
                    )
                  })}
                  {/* Resumen suma */}
                  <div className="flex flex-col justify-center px-4 py-3 bg-blue-100 rounded border border-blue-300 min-w-[90px] items-center ml-2">
                    <div className="font-extrabold text-xs text-blue-700 text-center mb-1">TOTAL</div>
                    <div className="font-black text-lg text-blue-950 text-center">
                      {getResumen(pid).toLocaleString()}
                    </div>
                  </div>
                </div>
                {/* Botón confirmar */}
                {!completed && pabellonCompleto(pid) && (
                  <div className="w-full flex justify-end pt-2">
                    <button
                      className="bg-green-600 hover:bg-green-700 text-white font-extrabold text-md px-6 py-2 rounded transition border-2 border-green-700 shadow"
                      onClick={() => setConfirmados({ ...confirmados, [pid]: true })}
                    >
                      Confirmar registro
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
        
        
        <button
        
        className="mb-2 px-6 py-2 bg-blue-600 text-white rounded font-bold shadow hover:bg-blue-800"
        onClick={()=>setVerHistorial(v=>!v)}
        >
          {verHistorial ? "Ocultar historial" : "Ver historial de producción"}
        </button>
        {verHistorial && <ProductionHistoryTable />}

      </div>
    </MainLayout>
  )
}

export default ProduccionPage
