import { useState } from "react";
import MainLayout from "../../layouts/mainlayout";
import KpiCard from "../../components/kpi/kpi-card";
import StockTable from "../../components/table/stock-table";
import MovimientosTable from "../../components/table/movimientos-table";
import { FiBox, FiLayers, FiAlertCircle, FiChevronDown, FiTrendingUp, FiX, FiPrinter, FiCheckCircle } from "react-icons/fi";
import {
  SKUS,
  CONTADORES,
  TRANSPORTISTAS,
  PABELLONES,
  ESTADOS_VALE,
  bodegamock,
  valespendientesmock
} from "../../constants";

function calcularTotal(sku, cajas, bandejas, unidades) {
  const especiales = ["CJA", "BAN", "DES", "DESE"];
  if (especiales.includes(sku)) {
    return cajas + bandejas + unidades;
  } else {
    return (cajas * 180) + (bandejas * 30) + unidades;
  }
}

const SkuFilterDropdown = ({ allSkus, skuFilter, setSkuFilter }) => {
  const [open, setOpen] = useState(false);
  const isAllSelected = skuFilter.length === allSkus.length;
  const handleSelectAll = () => setSkuFilter(isAllSelected ? [] : allSkus.map(s => s.sku));
  const handleCheck = sku =>
    setSkuFilter(selected =>
      selected.includes(sku)
        ? selected.filter(s => s !== sku)
        : [...selected, sku]
    );
  return (
    <div className="relative w-full max-w-xs">
      <button
        className="w-full border rounded px-3 py-2 bg-white text-sm flex items-center justify-between"
        onClick={() => setOpen(o => !o)}
        style={{minWidth:"100px"}}
        type="button"
      >
        Filtrar por SKU
        <FiChevronDown />
      </button>
      {open && (
        <div className="absolute z-20 bg-white shadow-lg rounded mt-1 w-full max-h-64 overflow-auto border text-xs">
          <label className="flex items-center gap-2 p-2 font-bold sticky top-0 bg-white border-b">
            <input type="checkbox" checked={isAllSelected} onChange={handleSelectAll}/> Seleccionar todos
          </label>
          {allSkus.map(skuObj =>
            <label key={skuObj.sku} className="flex items-center gap-2 p-2 cursor-pointer">
              <input
                type="checkbox"
                checked={skuFilter.includes(skuObj.sku)}
                onChange={()=>handleCheck(skuObj.sku)}
              />
              {skuObj.sku} - {skuObj.nombre}
            </label>
          )}
        </div>
      )}
    </div>
  );
};

const ContadoresPanel = ({ contadores, pabellones }) => {
  const relevantes = ["13", "14", "15"];
  return (
    <div className="bg-white rounded-xl shadow p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-700">Contadores del día</h2>
        <button className="px-3 py-1 bg-indigo-500 text-white rounded text-xs hover:bg-indigo-600"
          onClick={()=>window.location.href='/historial-contadores'}
        >Ver historial</button>
      </div>
      {pabellones.filter(p => relevantes.includes(p.id)).map(pab => (
        <div key={pab.id} className="mb-4">
          <h4 className="font-bold text-sm text-gray-600 mb-1">
            {pab.nombre}
          </h4>
          <div className="flex flex-wrap gap-4 ml-2">
            {contadores.filter(c => c.pabellon === pab.id).map(c => (
              <div key={c.id} className="flex items-center gap-2 p-2 rounded border bg-gray-50 min-w-[120px]">
                <span className="text-xs font-bold">C{c.id}</span>
                <span className="text-xs font-mono bg-yellow-100 rounded px-2 py-1">
                  PENDIENTE
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const BaldeCompactTable = ({ baldes }) => {
  const hoy = new Date().toISOString().split("T")[0];
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 w-full">
      <h3 className="text-sm font-bold mb-2 text-gray-700">Peso balde (merma)</h3>
      <table className="w-full text-xs">
        <thead>
          <tr>
            <th className="p-2 text-left">Fecha</th>
            <th className="p-2 text-right">Peso (kg)</th>
            <th className="p-2 text-right">Unidades</th>
          </tr>
        </thead>
        <tbody>
          {baldes.map((b,i)=>{
            const esHoy = b.fecha === hoy;
            const pendiente = esHoy && !b.peso;
            return (
              <tr key={i}>
                <td className="p-2">{b.fecha}</td>
                <td className="p-2 text-right">
                  {pendiente ? <span className="text-yellow-600 font-bold">PENDIENTE DE INGRESO</span> : `${b.peso} kg`}
                </td>
                <td className="p-2 text-right">
                  {pendiente ? "-" : `${Math.round((b.peso * 1000) / 60)} U`}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button className="mt-3 px-3 py-1 bg-indigo-500 text-white rounded text-xs hover:bg-indigo-600"
        onClick={()=>window.location.href='/historial-balde'}
      >Ver historial</button>
    </div>
  );
};

const TransportistasTable = ({ transportistas }) => (
  <div className="bg-white rounded-xl shadow p-6 mb-8">
    <h2 className="text-lg font-semibold mb-4 text-gray-700">Transportistas activos</h2>
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2 text-left">Nombre</th>
          <th className="p-2 text-left">Vehículo</th>
          <th className="p-2 text-left">Patente</th>
          <th className="p-2 text-left">Observación</th>
        </tr>
      </thead>
      <tbody>
        {transportistas.map(t => (
          <tr key={t.id} className="border-b hover:bg-gray-50">
            <td className="p-2">{t.nombre}</td>
            <td className="p-2">{t.vehiculo}</td>
            <td className="p-2">{t.patente}</td>
            <td className="p-2">{t.observacion || "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Dashboard = () => {
  const prodRealHoy = 12000;
  const prodRealAyer = 11765;
  const varProdReal = Math.round(100 * (prodRealHoy - prodRealAyer) / prodRealAyer);

  const prodTeoricaHoy = 12135;
  const prodTeoricaAyer = 11780;
  const varProdTeorica = Math.round(100 * (prodTeoricaHoy - prodTeoricaAyer) / prodTeoricaAyer);

  const sumaContadoresHoy = 12050;
  const sumaContadoresAyer = 11700;
  const varContadores = Math.round(100 * (sumaContadoresHoy - sumaContadoresAyer) / sumaContadoresAyer);

  const mermaHoy = 16.5;
  const mermaAyer = 13.2;
  const varMerma = Math.round(100 * (mermaHoy - mermaAyer) / mermaAyer);

  const stockArr = Array.isArray(bodegamock) ? bodegamock : [];
  const skuConMasCantidad = stockArr.length > 0
    ? stockArr.reduce((max, curr) => curr.totalunidades > max.totalunidades ? curr : max, stockArr[0])
    : { sku: "N/A", totalunidades: 0 };
  const skuConMenosCantidad = stockArr.length > 0
    ? stockArr.reduce((min, curr) => curr.totalunidades < min.totalunidades ? curr : min, stockArr[0])
    : { sku: "N/A", totalunidades: 0 };

  const [detalleMovimiento, setDetalleMovimiento] = useState(null);

  const contadoresPendientes = CONTADORES.length;
  const mermaPendiente = false;
  const valesPendientesCount = Array.isArray(valespendientesmock) ? valespendientesmock.filter(v => v.estado === "pendiente").length : 0;

  const ALL_SKUS = SKUS.map(s => ({ sku: s.sku, nombre: s.nombre }));
  const [skuFilter, setSkuFilter] = useState(ALL_SKUS.map(s => s.sku));

  const demoStock = [
    { sku: "BLA EXTRA", nombre: "Extra Blanco", c: 1, b: 2, u: 3 },
    { sku: "COL EXTRA", nombre: "Extra Color", c: 3, b: 1, u: 2 },
  ];
  const stock = SKUS.filter(s => skuFilter.includes(s.sku)).map(s => {
    const base = demoStock.find(x => x.sku === s.sku) || {c:0,b:0,u:0};
    return {
      sku: s.sku,
      nombre: s.nombre,
      c: base.c,
      b: base.b,
      u: base.u,
      total: calcularTotal(s.sku, base.c, base.b, base.u)
    };
  });

  const dummyMovs = [
    { id: 12, tipo: "Ingreso", fecha: "21/10/2025", sku: "BLA JUM", cajas: "10", bandejas: "2", unidades: "200", total: 220, estado: "Pendiente" },
    { id: 13, tipo: "Egreso", fecha: "20/10/2025", sku: "COL 1ERA", cajas: "-2", bandejas: "-1", unidades: "-30", total: -117, estado: "Validado" }
  ];

  const hoy = new Date().toISOString().split("T")[0];
  const baldes = [
    { fecha: hoy, peso: null },
    { fecha: "21/10/2025", peso: 16.5 },
    { fecha: "20/10/2025", peso: 13.2 }
  ];

  function verDetalle(mov) {
    setDetalleMovimiento(mov);
  }

  function imprimirVale() {
    window.print();
  }

  return (
    <MainLayout>
      <div className="flex flex-wrap gap-4 mb-8">
        <div className="bg-blue-50 rounded-xl shadow p-4 min-w-[200px] flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <FiBox size={22} className="text-blue-600"/>
            <span className="text-xs text-gray-700 font-semibold">Prod. real hoy vs ayer</span>
          </div>
          <div className="text-2xl font-bold text-blue-900">{prodRealHoy.toLocaleString()}</div>
          <span className={`text-sm font-semibold ${varProdReal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {varProdReal >= 0 ? '+' : ''}{varProdReal}%
          </span>
        </div>

        <div className="bg-indigo-50 rounded-xl shadow p-4 min-w-[200px] flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <FiLayers size={22} className="text-indigo-600"/>
            <span className="text-xs text-gray-700 font-semibold">Prod. teórica hoy vs ayer</span>
          </div>
          <div className="text-2xl font-bold text-indigo-900">{prodTeoricaHoy.toLocaleString()}</div>
          <span className={`text-sm font-semibold ${varProdTeorica >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {varProdTeorica >= 0 ? '+' : ''}{varProdTeorica}%
          </span>
        </div>

        <div className="bg-purple-50 rounded-xl shadow p-4 min-w-[200px] flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <FiCheckCircle size={22} className="text-purple-600"/>
            <span className="text-xs text-gray-700 font-semibold">Suma contadores hoy vs ayer</span>
          </div>
          <div className="text-2xl font-bold text-purple-900">{sumaContadoresHoy.toLocaleString()}</div>
          <span className={`text-sm font-semibold ${varContadores >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {varContadores >= 0 ? '+' : ''}{varContadores}%
          </span>
        </div>

        <div className="bg-yellow-50 rounded-xl shadow p-4 min-w-[200px] flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <FiTrendingUp size={22} className="text-yellow-600"/>
            <span className="text-xs text-gray-700 font-semibold">Merma hoy vs ayer</span>
          </div>
          <div className="text-2xl font-bold text-yellow-900">{mermaHoy} kg</div>
          <span className={`text-sm font-semibold ${varMerma >= 0 ? 'text-red-600' : 'text-green-600'}`}>
            {varMerma >= 0 ? '+' : ''}{varMerma}%
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-8">
        <div className="bg-green-50 rounded-xl shadow p-4 min-w-[200px] flex flex-col">
          <span className="text-xs text-gray-700 font-semibold mb-1">SKU con más stock</span>
          <div className="text-xl font-bold text-green-900">{skuConMasCantidad.sku}</div>
          <span className="text-sm text-gray-600">{skuConMasCantidad.totalunidades.toLocaleString()} u</span>
        </div>

        <div className="bg-orange-50 rounded-xl shadow p-4 min-w-[200px] flex flex-col">
          <span className="text-xs text-gray-700 font-semibold mb-1">SKU con menos stock</span>
          <div className="text-xl font-bold text-orange-900">{skuConMenosCantidad.sku}</div>
          <span className="text-sm text-gray-600">{skuConMenosCantidad.totalunidades.toLocaleString()} u</span>
        </div>
      </div>

      <div className="mb-8 space-y-3">
        {contadoresPendientes > 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded flex items-center gap-3">
            <FiAlertCircle size={24} className="text-yellow-600"/>
            <span className="text-sm font-semibold text-yellow-800">Falta ingresar {contadoresPendientes} contadores del día</span>
          </div>
        )}
        {mermaPendiente && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded flex items-center gap-3">
            <FiAlertCircle size={24} className="text-yellow-600"/>
            <span className="text-sm font-semibold text-yellow-800">Falta ingresar peso balde (merma) del día</span>
          </div>
        )}
        {valesPendientesCount > 0 && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FiAlertCircle size={28} className="text-red-600"/>
              <div>
                <div className="text-lg font-bold text-red-800">¡ATENCIÓN!</div>
                <div className="text-sm font-semibold text-red-700">Tienes {valesPendientesCount} vale(s) pendiente(s) de revisión</div>
              </div>
            </div>
            <button
              onClick={() => window.location.href = '/bodega'}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold"
            >
              Ver vales pendientes
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-end mb-3">
        <SkuFilterDropdown allSkus={ALL_SKUS} skuFilter={skuFilter} setSkuFilter={setSkuFilter}/>
      </div>

      <div className="mb-2 bg-white rounded-xl shadow-lg p-4 w-full">
        <h3 className="text-xl font-bold text-gray-700 mb-2">Stock en tiempo real</h3>
        <StockTable skus={stock} />
      </div>

      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Últimos movimientos</h2>
        <MovimientosTable data={dummyMovs} onVerDetalle={verDetalle} />
      </div>

      {detalleMovimiento && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative">
            <button onClick={() => setDetalleMovimiento(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
              <FiX size={28}/>
            </button>
            <h2 className="text-xl font-bold mb-4 text-center text-blue-700">Detalle del Movimiento</h2>
            <div className="mb-4 text-sm space-y-1">
              <p><b>Tipo:</b> {detalleMovimiento.tipo}</p>
              <p><b>Fecha:</b> {detalleMovimiento.fecha}</p>
              <p><b>SKU:</b> {detalleMovimiento.sku}</p>
              <p><b>Cajas:</b> {detalleMovimiento.cajas}</p>
              <p><b>Bandejas:</b> {detalleMovimiento.bandejas}</p>
              <p><b>Unidades:</b> {detalleMovimiento.unidades}</p>
              <p><b>Total:</b> {detalleMovimiento.total}</p>
              <p><b>Estado:</b> {detalleMovimiento.estado}</p>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={imprimirVale} className="flex items-center gap-2 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">
                <FiPrinter /> Imprimir PDF
              </button>
              <button onClick={() => setDetalleMovimiento(null)} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700">Cerrar</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <ContadoresPanel contadores={CONTADORES} pabellones={PABELLONES} />
        <BaldeCompactTable baldes={baldes} />
      </div>

      <TransportistasTable transportistas={TRANSPORTISTAS} />
    </MainLayout>
  );
};

export default Dashboard;
