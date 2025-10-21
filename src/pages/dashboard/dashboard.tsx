import { useState } from "react";
import MainLayout from "../../layouts/mainlayout";
import KpiCard from "../../components/kpi/kpi-card";
import StockTable from "../../components/table/stock-table";
import MovimientosTable from "../../components/table/movimientos-table";
import AlertPanel from "../../components/alert/alert-panel";
import { FiBox, FiLayers, FiAlertCircle, FiChevronDown, FiTrendingUp } from "react-icons/fi";
import {
  SKUS,
  CONTADORES,
  TRANSPORTISTAS,
  PABELLONES,
  ESTADOS_VALE
} from "../../constants";

// --- Cálculo de total de unidades por SKU ---
function calcularTotal(sku, cajas, bandejas, unidades) {
  const especiales = ["CJA", "BAN", "DES", "DESE"];
  if (especiales.includes(sku)) {
    // Usar sumatorio simple para SKUs especiales
    return cajas + bandejas + unidades;
  } else {
    // Lógica estándar: caja=180, bandeja=30, unidad=1
    return (cajas * 180) + (bandejas * 30) + unidades;
  }
}

// --- Filtro SKU tipo dropdown moderno ---
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

// --- Peso balde (merma) con unidades estimadas ---
const BaldeTable = ({ baldes }) => (
  <div className="bg-white rounded-xl shadow-lg p-4 mb-8 w-full">
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
        {baldes.map((b,i)=>
          <tr key={i}>
            <td className="p-2">{b.fecha}</td>
            <td className="p-2 text-right">{b.peso} kg</td>
            <td className="p-2 text-right">
              {Math.round((b.peso * 1000) / 60)} U
            </td>
          </tr>
        )}
      </tbody>
    </table>
    <button className="mt-3 px-3 py-1 bg-indigo-500 text-white rounded text-xs"
      onClick={()=>window.location.href='/historial-balde'}
    >Ver historial</button>
  </div>
);

// --- Contadores del día SOLO para pabellones relevantes ---
const ContadoresPanel = ({ contadores, pabellones }) => {
  // Pabellones que tienen contadores (13, 14, 15)
  const relevantes = ["13", "14", "15"];
  return (
    <div className="bg-white rounded-xl shadow p-6 mb-8">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">Contadores del día</h2>
      {pabellones.filter(p => relevantes.includes(p.id)).map(pab => (
        <div key={pab.id} className="mb-4">
          <h4 className="font-bold text-sm text-gray-600 mb-1">
            {pab.nombre}
          </h4>
          <div className="flex flex-wrap gap-4 ml-2">
            {contadores.filter(c => c.pabellon === pab.id).map(c => (
              <div key={c.id} className="flex flex-col items-center p-2 rounded border bg-gray-50 min-w-[80px]">
                <span className="text-xs font-bold">C{c.id}</span>
                <span className="text-xs">{c.nombre} <span className="text-gray-600">Línea {c.linea}, Cara {c.cara}</span></span>
                {/* Aquí mostrar el valor del contador (estado simulado - pendiente) */}
                <span className="text-sm mt-1 font-mono bg-yellow-100 rounded px-2 py-1">
                  Pendiente
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// --- Transportistas activos ---
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

// --- Dashboard principal ---
const Dashboard = () => {
  // KPIs: producción real, teórica, merma actual, % variación merma
  const mermaHoy = 16.5;           // ejemplo
  const mermaAyer = 13.2;          // ejemplo
  const mermaVar = Math.round(100 * (mermaHoy-mermaAyer)/mermaAyer);

  const dataKPIs = [
    { title: "Producción real hoy", value: 12000, percent: "+2%", color: "bg-blue-100", icon: <FiBox size={24}/> },
    { title: "Producción teórica hoy", value: 12135, percent: "+3%", color: "bg-indigo-100", icon: <FiLayers size={24}/> },
    { title: "Merma declarada", value: `${mermaHoy} kg`, percent: `${mermaVar > 0 ? "+" : ""}${mermaVar}% vs día anterior`, icon: <FiTrendingUp size={24}/>, color: "bg-yellow-100" }
  ];

  // Filtro SKU: extraer lista desde constants, pero omitir categorias especiales si lo deseas
  const ALL_SKUS = SKUS.map(s => ({ sku: s.sku, nombre: s.nombre }));
  const [skuFilter, setSkuFilter] = useState(ALL_SKUS.map(s => s.sku));

  // DATOS DE STOCK en tiempo real
  // Demo: puedes expandir con datos actualizados
  const demoStock = [
    { sku: "BLA EXTRA", nombre: "Extra Blanco", c: 1, b: 2, u: 3 },
    { sku: "COL EXTRA", nombre: "Extra Color", c: 3, b: 1, u: 2 },
    // Puedes agregar más con tus datos reales
  ];
  // Simulación real de cálculo sumatoria
  const stock = SKUS.filter(s => skuFilter.includes(s.sku)).map(s => {
    // Demo: buscar en demoStock las cajas/bandejas/unidades, default a 0
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

  // Últimos movimientos: conecta esto luego a helpers/backend
  const dummyMovs = [
    { id: 12, tipo: "Ingreso", fecha: "21/10/2025", sku: "BLA JUM", cajas: "10", bandejas: "2", unidades: "200", total: 220, estado: "Pendiente" },
    { id: 13, tipo: "Egreso", fecha: "20/10/2025", sku: "COL 1ERA", cajas: "-2", bandejas: "-1", unidades: "-30", total: -117, estado: "Validado" }
  ];

  // Peso balde con unidades (merma) ejemplo
  const baldes = [
    { fecha: "21/10/2025", peso: 16.5 },
    { fecha: "20/10/2025", peso: 13.2 }
  ];

  return (
    <MainLayout>
      {/* KPIs principales arriba */}
      <div className="flex flex-wrap gap-8 mb-8">
        {dataKPIs.map((k, i) =>
          <KpiCard key={i} title={k.title} value={k.value} percent={k.percent} color={k.color} icon={k.icon} />
        )}
        <div className="bg-yellow-100 rounded-xl shadow p-4 min-w-[240px] flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <FiAlertCircle size={23} className="text-yellow-600"/>
            <span className="text-sm text-gray-700 font-semibold">Vales pendientes</span>
          </div>
          <div className="text-2xl font-bold text-yellow-700">
            {ESTADOS_VALE.filter(e => e.key === "pendiente").length}
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs rounded px-3 py-1 mt-2 font-medium flex items-center gap-2"
            onClick={()=>window.location.href='/bodega'}>
            Ver vales pendientes
          </button>
        </div>
      </div>

      <AlertPanel />

      {/* Filtro de SKU moderno */}
      <div className="flex justify-end mb-3">
        <SkuFilterDropdown allSkus={ALL_SKUS} skuFilter={skuFilter} setSkuFilter={setSkuFilter}/>
      </div>

      {/* Tabla de stock en tiempo real */}
      <div className="mb-2 bg-white rounded-xl shadow-lg p-4 w-full">
        <h3 className="text-xl font-bold text-gray-700 mb-2">Stock en tiempo real</h3>
        <StockTable skus={stock} />
      </div>

      {/* Tabla de últimos movimientos */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Últimos movimientos</h2>
        <MovimientosTable data={dummyMovs} />
      </div>

      {/* Peso balde (merma) con unidades estimadas */}
      <BaldeTable baldes={baldes} />

      {/* Contadores solo para Pabellones 13, 14, 15 */}
      <ContadoresPanel contadores={CONTADORES} pabellones={PABELLONES} />

      {/* Transportistas activos abajo */}
      <TransportistasTable transportistas={TRANSPORTISTAS} />
    </MainLayout>
  );
};

export default Dashboard;
