import { useState } from "react";
import MainLayout from "../../layouts/mainlayout";
import { FiPlus, FiEdit, FiCheck, FiX, FiUsers, FiMapPin, FiTruck, FiSettings } from "react-icons/fi";
import type { UserRole } from "../../constants";

// Simula el usuario actual (debe venir de tu auth/context real)
const USUARIO_ACTUAL: { rol: UserRole } = { rol: "admin" };

// Áreas (desde constants.ts si lo exportas así)
const AREAS_AVICOLA = [
  "Gerencia","Oficina","Bodega","Packing","Fabrica","Pabelloneros",
  "Mantención","Vendedores","Atencion local D","Atencion local R","Aseo","Otro"
];
const AREA_OPTS = AREAS_AVICOLA.map(a => ({ value: a, label: a }));

const DESTINOS_INIT = [
  "Local D", "Local R", "Limpieza", "Vendedores", "Mayorista Ranc", "Mayorista Don", "Repartos",
  "Ración", "Desecho", "Caducidad", "Otro"
];

type Empleado = {
  id: number;
  activo: boolean;
  nombre: string;
  apellido: string;
  fechaNac?: string;
  area: string;
  tipoUsuario: UserRole;
  accesos: string[];
};
type Destino = { id: number; nombre: string; activo: boolean };
type Transporte = { id: number; activo: boolean; patente: string; nroFurgon: string; chofer: number };

const empleadosDemo: Empleado[] = [
  { id: 1, activo: true, nombre: "Nicolas", apellido: "Jugo", area: "Gerencia", tipoUsuario: "superadmin", accesos: ["Dashboard", "Config."] },
  { id: 2, activo: true, nombre: "Marcela", apellido: "Soto", area: "Oficina", tipoUsuario: "admin", accesos: ["Todos"] }
];

const transportesDemo: Transporte[] = [
  { id: 1, activo: true, patente: "AAZZ32", nroFurgon: "F01", chofer: 2 },
  { id: 2, activo: false, patente: "YYZZ87", nroFurgon: "F02", chofer: 2 }
];

const destinosDemo: Destino[] = DESTINOS_INIT.map((n, i) => ({ id: i + 1, nombre: n, activo: true }));

const TABS = [
  { key: "empleados", label: "Empleados", icon: <FiUsers /> },
  { key: "destinos", label: "Destinos", icon: <FiMapPin /> },
  { key: "transporte", label: "Transporte", icon: <FiTruck /> }
];

const accesosOpts = ["Dashboard", "Packing", "Producción", "Bodega", "Reportes", "Config."];

const ConfiguracionPage = () => {
  const [tab, setTab] = useState(TABS[0].key);

  const [empleados, setEmpleados] = useState<Empleado[]>(empleadosDemo);
  const [editEmpleado, setEditEmpleado] = useState<Empleado | null>(null);

  const nextId = empleados.length > 0 ? Math.max(...empleados.map(e => e.id)) + 1 : 1;
  const [nuevoEmp, setNuevoEmp] = useState<Empleado>({ id: nextId, activo: true, nombre: "", apellido: "", area: AREA_OPTS[0].value, tipoUsuario: "bodega", accesos: [] });

  const [destinos, setDestinos] = useState<Destino[]>(destinosDemo);
  const [nuevoDestino, setNuevoDestino] = useState<string>("");

  const [transportes, setTransportes] = useState<Transporte[]>(transportesDemo);
  const [editTransporte, setEditTransporte] = useState<Transporte | null>(null);
  const [nuevoTrans, setNuevoTrans] = useState<Transporte>({ id: transportes.length > 0 ? Math.max(...transportes.map(e => e.id)) + 1 : 1, activo: true, patente: "", nroFurgon: "", chofer: empleados[0]?.id || 0 });

  // --- EMPL CRUD ---
  const saveEmpleado = () => {
    if (!nuevoEmp.nombre.trim() || !nuevoEmp.area.trim() || !nuevoEmp.tipoUsuario) return;
    setEmpleados([...empleados, { ...nuevoEmp, id: nextId }]);
    setNuevoEmp({ id: nextId + 1, activo: true, nombre: "", apellido: "", area: AREA_OPTS[0].value, tipoUsuario: "bodega", accesos: [] });
  };
  const updateEmpleado = () => {
    if (!editEmpleado) return;
    setEmpleados(empleados.map(e => e.id === editEmpleado.id ? editEmpleado : e));
    setEditEmpleado(null);
  };
  const deleteEmpleado = (id: number) => {
    if (!["admin", "superadmin"].includes(USUARIO_ACTUAL.rol)) return;
    const e = empleados.find(e=>e.id===id);
    if (!e || e.tipoUsuario === "superadmin") return;
    if (window.confirm("¿Seguro que quieres eliminar este empleado?")) {
      setEmpleados(empleados.filter(e => e.id !== id));
    }
  };

  // --- DESTINOS CRUD ---
  const saveDestino = () => {
    if (!nuevoDestino.trim()) return;
    setDestinos([...destinos, { id: destinos.length > 0 ? Math.max(...destinos.map(d=>d.id))+1 : 1, nombre: nuevoDestino, activo:true }]);
    setNuevoDestino("");
  };
  const setActivoDestino = (id:number, estado:boolean) => setDestinos(destinos.map(d=>d.id===id?{...d,activo:estado}:d));
  
  // --- TRANSPORTE CRUD ---
  const saveTransporte = () => {
    if (!nuevoTrans.patente) return;
    setTransportes([...transportes, { ...nuevoTrans, id: transportes.length > 0 ? Math.max(...transportes.map(t=>t.id))+1 : 1 }]);
    setNuevoTrans({ id: transportes.length > 0 ? Math.max(...transportes.map(t=>t.id))+2 : 2, activo: true, patente: "", nroFurgon: "", chofer: empleados[0]?.id || 0 });
  };
  const updateTransporte = () => {
    if (!editTransporte) return;
    setTransportes(transportes.map(t => t.id === editTransporte.id ? editTransporte : t));
    setEditTransporte(null);
  };
  const setActivoTransporte = (id: number, estado: boolean) => setTransportes(transportes.map(t => t.id === id ? { ...t, activo: estado } : t));

  return (
    <MainLayout>
      <div className="p-6 space-y-8 w-full max-w-5xl mx-auto">
        <h1 className="text-3xl font-black text-gray-900 mb-4 flex items-center gap-2"><FiSettings />Configuración</h1>
        <div className="flex gap-3 mb-4">
          {TABS.map(t => (
            <button
              key={t.key}
              className={`px-5 py-2 rounded font-semibold flex items-center gap-2 text-sm ${tab === t.key ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900 hover:bg-blue-100"}`}
              onClick={() => setTab(t.key)}
            >
              {t.icon}{t.label}
            </button>
          ))}
        </div>
        {tab === "empleados" && (
          <section className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <FiUsers className="text-blue-500" /><h2 className="font-bold text-lg">Empleados</h2>
            </div>
            <div className="flex flex-col md:flex-row gap-4 mb-5">
              {(editEmpleado ? (
                <div className="bg-blue-50 rounded p-3 min-w-[280px]">
                  <h3 className="font-semibold text-blue-700 mb-2">Editar empleado</h3>
                  <input className="mb-2 w-full border px-2 py-1 rounded" placeholder="Nombre" value={editEmpleado.nombre} onChange={e=>setEditEmpleado({...editEmpleado,nombre:e.target.value})} />
                  <input className="mb-2 w-full border px-2 py-1 rounded" placeholder="Apellido" value={editEmpleado.apellido} onChange={e=>setEditEmpleado({...editEmpleado,apellido:e.target.value})} />
                  <input className="mb-2 w-full border px-2 py-1 rounded" type="date" value={editEmpleado.fechaNac||""} onChange={e=>setEditEmpleado({...editEmpleado,fechaNac:e.target.value})} />
                  <select className="mb-2 w-full border px-2 py-1 rounded" value={editEmpleado.area} onChange={e=>setEditEmpleado({...editEmpleado,area:e.target.value})}>
                    {AREA_OPTS.map(a=><option key={a.value} value={a.value}>{a.label}</option>)}
                  </select>
                  <select className="mb-2 w-full border px-2 py-1 rounded" value={editEmpleado.tipoUsuario} onChange={e=>setEditEmpleado({...editEmpleado,tipoUsuario:e.target.value as UserRole})}>
                    {(["superadmin","admin","bodega","packing","colaborador","lector"] as UserRole[]).map(t=><option key={t} value={t}>{t}</option>)}
                  </select>
                  <div className="mb-2 flex flex-wrap gap-2">{accesosOpts.map(acc => (
                    <label key={acc} className="flex items-center gap-1 text-xs">
                      <input
                        type="checkbox"
                        checked={editEmpleado.accesos.includes(acc)}
                        onChange={() =>
                          setEditEmpleado({
                            ...editEmpleado,
                            accesos: editEmpleado.accesos.includes(acc)
                              ? editEmpleado.accesos.filter(a => a !== acc)
                              : [...editEmpleado.accesos, acc]
                          })
                        }
                      />
                      {acc}
                    </label>
                  ))}</div>
                  <div className="mb-2">
                    <label className="mr-2 text-sm">Activo?</label>
                    <input type="checkbox" checked={editEmpleado.activo} onChange={e=>setEditEmpleado({...editEmpleado,activo:e.target.checked})} />
                  </div>
                  <div className="flex gap-2">
                    {(USUARIO_ACTUAL.rol === "admin" || USUARIO_ACTUAL.rol === "superadmin") && (
                      <button className="px-3 py-1 bg-green-500 text-white rounded" onClick={updateEmpleado}><FiCheck />Guardar</button>
                    )}
                    <button className="px-3 py-1 bg-gray-200 rounded" onClick={()=>setEditEmpleado(null)}><FiX />Cancelar</button>
                  </div>
                </div>
              ) : (
                <div className="bg-blue-50 rounded p-3 min-w-[280px]">
                  <h3 className="font-semibold text-blue-700 mb-2">Nuevo empleado</h3>
                  <input className="mb-2 w-full border px-2 py-1 rounded" placeholder="Nombre" value={nuevoEmp.nombre} onChange={e=>setNuevoEmp({...nuevoEmp,nombre:e.target.value})} />
                  <input className="mb-2 w-full border px-2 py-1 rounded" placeholder="Apellido" value={nuevoEmp.apellido} onChange={e=>setNuevoEmp({...nuevoEmp,apellido:e.target.value})} />
                  <input className="mb-2 w-full border px-2 py-1 rounded" type="date" value={nuevoEmp.fechaNac||""} onChange={e=>setNuevoEmp({...nuevoEmp,fechaNac:e.target.value})} />
                  <select className="mb-2 w-full border px-2 py-1 rounded" value={nuevoEmp.area} onChange={e=>setNuevoEmp({...nuevoEmp,area:e.target.value})}>
                    {AREA_OPTS.map(a=><option key={a.value} value={a.value}>{a.label}</option>)}
                  </select>
                  <select className="mb-2 w-full border px-2 py-1 rounded" value={nuevoEmp.tipoUsuario} onChange={e=>setNuevoEmp({...nuevoEmp,tipoUsuario:e.target.value as UserRole})}>
                    {(["superadmin","admin","bodega","packing","colaborador","lector"] as UserRole[]).map(t=><option key={t} value={t}>{t}</option>)}
                  </select>
                  <div className="mb-2 flex flex-wrap gap-2">{accesosOpts.map(acc=>(
                    <label key={acc} className="flex items-center gap-1 text-xs">
                      <input type="checkbox" checked={nuevoEmp.accesos.includes(acc)} onChange={() =>
                        setNuevoEmp({...nuevoEmp,accesos: nuevoEmp.accesos.includes(acc) ? nuevoEmp.accesos.filter(a=>a!==acc) : [...nuevoEmp.accesos,acc]
                        })} />
                      {acc}
                    </label>
                  ))}</div>
                  <div className="mb-2">
                    <label className="mr-2 text-sm">Activo?</label>
                    <input type="checkbox" checked={nuevoEmp.activo} onChange={e=>setNuevoEmp({...nuevoEmp,activo:e.target.checked})} />
                  </div>
                  {(USUARIO_ACTUAL.rol === "admin" || USUARIO_ACTUAL.rol === "superadmin") && (
                    <button className="px-3 py-1 bg-green-600 text-white rounded flex items-center gap-1" onClick={saveEmpleado}><FiPlus className="text-lg" />Agregar</button>
                  )}
                </div>
              ))}
              <div className="flex-1">
                <table className="min-w-max w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50">
                      <th>ID</th><th>Activo</th><th>Nombre</th><th>Apellido</th><th>Área</th><th>Rol</th><th>Accesos</th><th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {empleados.map(emp=>(
                      <tr key={emp.id} className="border-b last:border-b-0">
                        <td>{emp.id}</td>
                        <td className="text-center">{emp.activo?<>✔️</>:<>❌</>}</td>
                        <td>{emp.nombre}</td>
                        <td>{emp.apellido}</td>
                        <td>{emp.area}</td>
                        <td>{emp.tipoUsuario}</td>
                        <td>{emp.accesos.join(", ")}</td>
                        <td>
                          {(emp.tipoUsuario !== "superadmin") && (USUARIO_ACTUAL.rol === "admin" || USUARIO_ACTUAL.rol === "superadmin") &&
                            <>
                              <button className="mr-2 text-blue-500" onClick={()=>setEditEmpleado(emp)}><FiEdit /></button>
                              <button className="text-red-600" onClick={()=>deleteEmpleado(emp.id)}><FiX /></button>
                            </>
                          }
                        </td>
                      </tr>
                    ))}
                    {empleados.length === 0 && (<tr><td colSpan={8} className="text-center text-gray-400">Sin empleados</td></tr>)}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
        {tab === "destinos" && (
          <section className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <FiMapPin className="text-green-500" /><h2 className="font-bold text-lg">Destinos configurables</h2>
            </div>
            <div className="flex gap-2 flex-wrap mb-3 items-center">
              <input className="border px-2 py-1 rounded" style={{ minWidth: 200 }} placeholder="Nuevo destino..." value={nuevoDestino}
                onChange={e=>setNuevoDestino(e.target.value)} />
              <button className="px-3 py-1 bg-green-600 text-white rounded flex items-center gap-1" onClick={saveDestino}>
                <FiPlus className="text-lg" />Agregar
              </button>
            </div>
            <table className="min-w-max w-full text-xs">
              <thead>
                <tr className="bg-gray-50"><th>ID</th><th>Nombre</th><th>Activo</th></tr>
              </thead>
              <tbody>
                {destinos.map(dest=>(
                  <tr key={dest.id} className="border-b last:border-b-0">
                    <td>{dest.id}</td>
                    <td>{dest.nombre}</td>
                    <td className="text-center"><input type="checkbox" checked={dest.activo} onChange={e=>setActivoDestino(dest.id, e.target.checked)} /></td>
                  </tr>
                ))}
                {destinos.length === 0 && (<tr><td colSpan={3} className="text-center text-gray-400">Sin destinos</td></tr>)}
              </tbody>
            </table>
          </section>
        )}
        {tab === "transporte" && (
          <section className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-3 mb-2">
              <FiTruck className="text-indigo-500" /><h2 className="font-bold text-lg">Transporte</h2>
            </div>
            <div className="flex flex-col md:flex-row gap-4 mb-5">
              {editTransporte ? (
                <div className="bg-indigo-50 rounded p-3 min-w-[260px]">
                  <h3 className="font-semibold text-indigo-700 mb-2">Editar transporte</h3>
                  <input className="mb-2 w-full border px-2 py-1 rounded" placeholder="Patente" value={editTransporte.patente} onChange={e=>setEditTransporte({...editTransporte,patente:e.target.value})} />
                  <input className="mb-2 w-full border px-2 py-1 rounded" placeholder="Furgón" value={editTransporte.nroFurgon} onChange={e=>setEditTransporte({...editTransporte,nroFurgon:e.target.value})} />
                  <select className="mb-2 w-full border px-2 py-1 rounded" value={editTransporte.chofer} onChange={e=>setEditTransporte({...editTransporte,chofer:Number(e.target.value)})}>
                    {empleados.filter(e=>e.activo).map(e=><option key={e.id} value={e.id}>{e.nombre} {e.apellido}</option>)}
                  </select>
                  <div className="mb-2">
                    <label className="mr-2 text-sm">Activo?</label>
                    <input type="checkbox" checked={editTransporte.activo} onChange={e=>setEditTransporte({...editTransporte,activo:e.target.checked})} />
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={updateTransporte}><FiCheck />Guardar</button>
                    <button className="px-3 py-1 bg-gray-200 rounded" onClick={()=>setEditTransporte(null)}><FiX />Cancelar</button>
                  </div>
                </div>
              ) : (
                <div className="bg-indigo-50 rounded p-3 min-w-[260px]">
                  <h3 className="font-semibold text-indigo-700 mb-2">Nuevo transporte</h3>
                  <input className="mb-2 w-full border px-2 py-1 rounded" placeholder="Patente" value={nuevoTrans.patente} onChange={e=>setNuevoTrans({...nuevoTrans,patente:e.target.value})} />
                  <input className="mb-2 w-full border px-2 py-1 rounded" placeholder="Furgón" value={nuevoTrans.nroFurgon} onChange={e=>setNuevoTrans({...nuevoTrans,nroFurgon:e.target.value})} />
                  <select className="mb-2 w-full border px-2 py-1 rounded" value={nuevoTrans.chofer} onChange={e=>setNuevoTrans({...nuevoTrans,chofer:Number(e.target.value)})}>
                    {empleados.filter(e=>e.activo).map(e=><option key={e.id} value={e.id}>{e.nombre} {e.apellido}</option>)}
                  </select>
                  <div className="mb-2">
                    <label className="mr-2 text-sm">Activo?</label>
                    <input type="checkbox" checked={nuevoTrans.activo} onChange={e=>setNuevoTrans({...nuevoTrans,activo:e.target.checked})} />
                  </div>
                  <button className="px-3 py-1 bg-indigo-600 text-white rounded flex items-center gap-1" onClick={saveTransporte}><FiPlus className="text-lg" />Agregar</button>
                </div>
              )}
              <div className="flex-1">
                <table className="min-w-max w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50">
                      <th>ID</th><th>Activo</th><th>Patente</th><th>Furgón</th><th>Chofer</th><th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {transportes.map(tr=>(
                      <tr key={tr.id} className="border-b last:border-b-0">
                        <td>{tr.id}</td>
                        <td className="text-center"><input type="checkbox" checked={tr.activo} onChange={e=>setActivoTransporte(tr.id, e.target.checked)} /></td>
                        <td>{tr.patente}</td>
                        <td>{tr.nroFurgon}</td>
                        <td>{empleados.find(e=>e.id===tr.chofer)?.nombre || "-"}</td>
                        <td>{editTransporte?.id === tr.id ? null : (
                          <button className="mr-2 text-indigo-600" onClick={()=>setEditTransporte(tr)}><FiEdit /></button>
                        )}</td>
                      </tr>
                    ))}
                    {transportes.length === 0 && (<tr><td colSpan={6} className="text-center text-gray-400">Sin transportes</td></tr>)}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </div>
    </MainLayout>
  );
};

export default ConfiguracionPage;
