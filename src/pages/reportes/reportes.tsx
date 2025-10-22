import { useState } from "react";
import MainLayout from "../../layouts/mainlayout";
import { SKUS, PABELLONES, valespackingmock, movimientosmock, TRANSPORTISTAS, getpabellonesactivos } from "../../constants";
import { FiBarChart, FiDownload, FiFileText, FiAlertTriangle, FiTruck, FiArrowDownCircle } from "react-icons/fi";
import { exportToCSV } from "../../helpers/exportCSV";
import { exportToPDF } from "../../helpers/exportPDF";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from "recharts";

// Helpers para selects
const ALL_SKUS = SKUS.map(s => ({ value: s.sku, label: s.nombre }));
const ALL_PABELLONES = getpabellonesactivos().map(pab => ({ value: pab.id, label: pab.nombre }));

// Filtros iniciales
const initialFiltroSkus = ALL_SKUS.map(e => e.value);
const initialFiltroPabellones = ALL_PABELLONES.map(e => e.value);

const ReportesPage = () => {
  // Filtros
  const [filtroFechaInicio, setFiltroFechaInicio] = useState("");
  const [filtroFechaFin, setFiltroFechaFin] = useState("");
  const [filtroSKU, setFiltroSKU] = useState<string[]>(initialFiltroSkus);
  const [filtroPabellon, setFiltroPabellon] = useState<string[]>(initialFiltroPabellones);

  // Data base
  const valesPacking = valespackingmock;
  const movimientosBodega = movimientosmock;

  // Filtro general
  const filtrarData = <T,>(data: T[], campos: { fecha?: true; sku?: true; pabellon?: true }) =>
    data.filter((item: any) => {
      if (filtroFechaInicio && item.fecha < filtroFechaInicio) return false;
      if (filtroFechaFin && item.fecha > filtroFechaFin) return false;
      if (filtroSKU.length && campos.sku && !filtroSKU.includes(item?.detalles?.[0]?.sku || item?.sku)) return false;
      if (filtroPabellon.length && campos.pabellon && !filtroPabellon.includes(item.pabellonid || item.pabellon)) return false;
      return true;
    });

  // Filtrado por criterios
  const vales = filtrarData(valesPacking, { fecha: true, sku: true, pabellon: true });
  const movimientos = filtrarData(movimientosBodega, { fecha: true, sku: true, pabellon: true });

  // KPI mega resumen
  const prodReal = Math.round(vales.reduce((a, v) => a + (v.totalunidadesempaquetadas ?? 0), 0));
  const prodTeo = Math.round(15000);
  const merma = Math.round(450);
  const eficiencia = prodTeo ? ((prodReal / prodTeo) * 100) : 0;
  const variacion = prodTeo ? ((prodReal - prodTeo) / prodTeo * 100) : 0;
  const mermaPorc = prodTeo ? ((merma / prodTeo) * 100) : 0;

  // Stock bajo: cualquier SKU con menos de 200 unidades.
  const stockBajos = movimientos
    .filter((m: any) => m.totalunidades < 200)
    .map((m: any) => m.sku);

  // Ranking SKU por rotación
  const rankingSKUs = {};
  movimientos.forEach((m: any) => {
    rankingSKUs[m.sku] = (rankingSKUs[m.sku] || 0) + m.totalunidades;
  });
  const skuMayorRot = Object.entries(rankingSKUs).sort((a, b) => b[1] as number - a[1] as number)[0];

  // Día con más/menos movimiento
  const movimientosPorDia = {};
  movimientos.forEach((m: any) => {
    movimientosPorDia[m.fecha] = (movimientosPorDia[m.fecha] || 0) + m.totalunidades;
  });
  const diasRank = Object.entries(movimientosPorDia).sort((a, b) => b[1] as number - a[1] as number);
  const mejorDia = diasRank[0]?.[0] ?? "-";
  const peorDia = diasRank[diasRank.length - 1]?.[0] ?? "-";

  // Porcentaje de participación por pabellón
  const prodPorPabellon = ALL_PABELLONES.map(p => ({
    pabellon: p.label,
    real: Math.round(prodReal / ALL_PABELLONES.length),
    teorica: Math.round(prodTeo / ALL_PABELLONES.length),
    eficiencia: eficiencia,
    porcentaje: Math.round((prodReal / (ALL_PABELLONES.length * prodReal)) * 100)
  }));

  // Ranking transportistas por volumen (random demo)
  const rankingTrans = {};
  movimientos.forEach((m: any) => {
    let nombre = m?.operador || "Desconocido";
    rankingTrans[nombre] = (rankingTrans[nombre] || 0) + m.totalunidades;
  });
  const topTransportista = Object.entries(rankingTrans).sort((a, b) => b[1] as number - a[1] as number)[0];

  // Export
  const handleExportCSV = () => exportToCSV(vales, "reporte_vales_packing");
  const handleExportPDF = () => exportToPDF(vales, "reporte_vales_packing");

  // Alertas inteligentes
  const alertas: string[] = [];
  if (eficiencia < 85) alertas.push("⚠️ Eficiencia baja (<85%)");
  if (variacion < -7) alertas.push(`▶ Producción real menor a la teórica por más de ${Math.abs(variacion).toFixed(1)}%`);
  if (mermaPorc > 8) alertas.push(`🔴 Merma sobre 8% del total`);
  if (stockBajos.length) alertas.push(`🟠 Stock bajo en: ${stockBajos.join(", ")}`);
  if (skuMayorRot && skuMayorRot[1] < 500) alertas.push(`❕ Ningún SKU supera rotación alta en periodo seleccionado.`);

  // Select compacto estético
  function MultiSelectCompact({
    options, selected, onChange, allLabel, label
  }: { options: any[]; selected: string[]; onChange: (val: string[]) => void; allLabel: string; label: string }) {
    const allSelected = selected.length === options.length;
    const toggleAll = () => onChange(allSelected ? [] : options.map(o => o.value));
    return (
      <div className="flex flex-col gap-1 min-w-[220px]">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-gray-700">{label}</span>
          <button type="button" className="text-xs px-2 py-0.5 bg-gray-100 rounded hover:bg-gray-200" onClick={() => onChange([])}>Limpiar</button>
        </div>
        <div className="flex flex-wrap gap-2">
          <label className="flex items-center gap-1 cursor-pointer text-xs font-bold">
            <input type="checkbox" checked={allSelected} onChange={toggleAll} />
            {allLabel}
          </label>
          {options.map(opt => (
            <label key={opt.value} className="flex items-center gap-1 cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={selected.includes(opt.value)}
                onChange={() =>
                  selected.includes(opt.value)
                    ? onChange(selected.filter(v => v !== opt.value))
                    : onChange([...selected, opt.value])
                }
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="p-6 space-y-6 w-full">
        <h1 className="text-3xl font-black text-gray-900 mb-2">Reportes y Análisis</h1>

        {/* --- Alertas --- */}
        {alertas.length > 0 && (
          <div className="bg-red-50 border border-red-300 rounded-lg px-4 py-2 mb-3 flex gap-4 items-center">
            <FiAlertTriangle className="text-red-500" />
            <div className="text-red-700 text-sm font-semibold flex flex-col gap-1">{alertas.map((a, i) => <span key={i}>{a}</span>)}</div>
          </div>
        )}

        {/* KPIs resumen, variacion */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-2">
          <KpiCard title="Prod. Real" value={prodReal} color="blue" />
          <KpiCard title="Prod. Teórica" value={prodTeo} color="indigo" />
          <KpiCard title="Merma" value={merma} color="yellow" subtitle={`${mermaPorc.toFixed(1)}%`} />
          <KpiCard title="Eficiencia" value={eficiencia.toFixed(1)+"%"} color={eficiencia < 85 ? "red" : "green"} subtitle={`Var. ${variacion.toFixed(1)}%`} />
          <KpiCard title="SKU + rotación" value={(skuMayorRot && skuMayorRot[0]) || "-"} color="gray" subtitle={(skuMayorRot && Math.round(Number(skuMayorRot[1])))||""} />
          <KpiCard title="Transportista Top" value={(topTransportista && topTransportista[0]) || "-"} color="emerald" subtitle={(topTransportista && Math.round(Number(topTransportista[1])))||""} />
        </div>

        {/* Info extra: día movimiento, peor día, stock bajo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm mb-2">
          <div className="bg-blue-50 border rounded-lg p-2">Día mayor mov.: <b>{mejorDia}</b></div>
          <div className="bg-yellow-50 border rounded-lg p-2">Día menor mov.: <b>{peorDia}</b></div>
          <div className="bg-orange-50 border rounded-lg p-2">SKU stock bajo: <b>{stockBajos.length ? stockBajos.join(", ") : "-"}</b></div>
        </div>

        {/* Filtros SUPER compactos */}
        <div className="bg-white shadow rounded-lg p-3 mb-4 flex gap-4 justify-start items-center flex-wrap">
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Fecha desde</label>
            <input
              type="date"
              className="w-32 border px-2 py-1 rounded text-xs"
              value={filtroFechaInicio}
              onChange={e => setFiltroFechaInicio(e.target.value)}
              max={filtroFechaFin ? filtroFechaFin : undefined}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Fecha hasta</label>
            <input
              type="date"
              className="w-32 border px-2 py-1 rounded text-xs"
              value={filtroFechaFin}
              onChange={e => setFiltroFechaFin(e.target.value)}
              min={filtroFechaInicio ? filtroFechaInicio : undefined}
            />
          </div>
          <MultiSelectCompact
            options={ALL_SKUS}
            selected={filtroSKU}
            onChange={setFiltroSKU}
            allLabel="Todos los SKU"
            label="SKU"
          />
          <MultiSelectCompact
            options={ALL_PABELLONES}
            selected={filtroPabellon}
            onChange={setFiltroPabellon}
            allLabel="Todos los pabellones"
            label="Pabellón"
          />
          <button className="px-3 py-2 bg-gray-200 rounded text-xs font-semibold hover:bg-gray-300 ml-auto"
            onClick={() => {
              setFiltroFechaInicio(""); setFiltroFechaFin("");
              setFiltroSKU(initialFiltroSkus); setFiltroPabellon(initialFiltroPabellones);
            }}>Limpiar Filtros</button>
        </div>

        {/* --- Botones - Export --- */}
        <div className="flex gap-2 items-center mb-2">
          <button
            className="px-3 py-2 bg-green-500 text-white rounded text-sm font-semibold flex gap-2 items-center"
            onClick={handleExportCSV}
          >
            <FiDownload /> Exportar CSV
          </button>
          <button
            className="px-3 py-2 bg-indigo-500 text-white rounded text-sm font-semibold flex gap-2 items-center"
            onClick={handleExportPDF}
          >
            <FiFileText /> Exportar PDF
          </button>
        </div>

        {/* --- SOLO GRÁFICOS - DASHBOARD VISUAL --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Producción real v/s teórica y variación */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold text-base text-blue-800 mb-3">Producción real vs teórica</h3>
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={[{ name: "Real", value: prodReal }, { name: "Teórica", value: prodTeo }]}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#38bdf8" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-2 text-center text-sm text-blue-500 font-bold">
              Variación: {variacion.toFixed(1)}%
            </div>
          </div>

          {/* Tendencia producción y merma por día */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold text-base text-indigo-800 mb-3">Tendencia producción / merma</h3>
            <ResponsiveContainer width="100%" height={230}>
              <LineChart data={[
                { dia: "Lun", real: 4800, teorica: 5000, merma: 100 },
                { dia: "Mar", real: 4900, teorica: 5000, merma: 110 },
                { dia: "Mie", real: 4750, teorica: 5000, merma: 97 },
                { dia: "Jue", real: 5000, teorica: 5000, merma: 120 },
                { dia: "Vie", real: 5100, teorica: 5000, merma: 123 }
              ]}>
                <XAxis dataKey="dia" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="real" stroke="#3b82f6" name="Real" />
                <Line type="monotone" dataKey="teorica" stroke="#6366f1" name="Teórica" />
                <Line type="monotone" dataKey="merma" stroke="#eab308" name="Merma" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Rotación SKUs */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold text-base text-green-800 mb-3">Rotación de SKUs periodo</h3>
            <ResponsiveContainer width="100%" height={230}>
              <BarChart
                data={Object.entries(rankingSKUs)
                  .map(([sku, qty]) => ({
                    sku,
                    qty: Math.round(Number(qty))
                  }))
                  .sort((a, b) => b.qty - a.qty).slice(0, 6)
                }
              >
                <XAxis dataKey="sku" angle={-35} textAnchor="end" interval={0} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="qty" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Ranking transportistas */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold text-base text-emerald-700 mb-3 flex items-center gap-2"><FiTruck />Ranking transportistas</h3>
            <ResponsiveContainer width="100%" height={230}>
              <BarChart
                data={Object.entries(rankingTrans)
                  .map(([tr, qty]) => ({
                    tr,
                    qty: Math.round(Number(qty))
                  }))
                  .sort((a, b) => b.qty - a.qty).slice(0, 6)
                }
              >
                <XAxis dataKey="tr" angle={-35} textAnchor="end" interval={0} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="qty" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Porcentaje de eficiencia y participación pabellones */}
          <div className="bg-white p-4 rounded-lg shadow md:col-span-2">
            <h3 className="font-bold text-base text-gray-700 mb-3">Eficiencia y % de producción por pabellón</h3>
            <ResponsiveContainer width="100%" height={235}>
              <BarChart data={prodPorPabellon}>
                <XAxis dataKey="pabellon" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="real" fill="#38bdf8" name="Real" />
                <Bar dataKey="teorica" fill="#6366f1" name="Teórica" />
                <Bar dataKey="porcentaje" fill="#f59e42" name="% del total" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

// KPI card compacta arriba
function KpiCard({title, value, color, subtitle}: {title: string; value: any; color?: string; subtitle?: string}) {
  const colors = {
    blue: "bg-blue-50 text-blue-900 border-blue-300",
    indigo: "bg-indigo-50 text-indigo-900 border-indigo-300",
    yellow: "bg-yellow-50 text-yellow-900 border-yellow-300",
    green: "bg-green-50 text-green-900 border-green-300",
    red: "bg-red-50 text-red-900 border-red-300",
    gray: "bg-gray-50 text-gray-900 border-gray-300",
    emerald: "bg-emerald-50 text-emerald-900 border-emerald-300"
  };
  return (
    <div className={`rounded-lg shadow p-3 border-2 flex flex-col items-center ${colors[color ?? "blue"]}`}>
      <span className="font-semibold text-xs mb-1">{title}</span>
      <span className="text-xl font-bold">{typeof value === "number" ? Math.round(value) : value}</span>
      {subtitle && <span className="text-xs mt-1">{subtitle}</span>}
    </div>
  );
}

export default ReportesPage;
