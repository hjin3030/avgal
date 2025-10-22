// --- SKUS de productos/stock ---
export interface SkuDef {
  sku: string;
  nombre: string;
  tipo: "huevo" | "merma" | "desecho" | "otro";
  unidadCaja: number;
  unidadBandeja: number;
  color?: string;
}

export const SKUS: SkuDef[] = [
  { sku: "BLA JUM", nombre: "Jumbo Blanco", tipo: "huevo", unidadCaja: 100, unidadBandeja: 20 },
  { sku: "COL JUM", nombre: "Jumbo Color", tipo: "huevo", unidadCaja: 100, unidadBandeja: 20 },
  { sku: "BLA SUPER", nombre: "Super Extra Blanco", tipo: "huevo", unidadCaja: 100, unidadBandeja: 20 },
  { sku: "COL SUPER", nombre: "Super Extra Color", tipo: "huevo", unidadCaja: 100, unidadBandeja: 20 },
  { sku: "BLA EXTRA", nombre: "Extra Blanco", tipo: "huevo", unidadCaja: 180, unidadBandeja: 30 },
  { sku: "COL EXTRA", nombre: "Extra Color", tipo: "huevo", unidadCaja: 180, unidadBandeja: 30 },
  { sku: "BLA 1ERA", nombre: "1era Blanco", tipo: "huevo", unidadCaja: 180, unidadBandeja: 30 },
  { sku: "COL 1ERA", nombre: "1era Color", tipo: "huevo", unidadCaja: 180, unidadBandeja: 30 },
  { sku: "BLA 2DA", nombre: "2da Blanco", tipo: "huevo", unidadCaja: 180, unidadBandeja: 30 },
  { sku: "COL 2DA", nombre: "2da Color", tipo: "huevo", unidadCaja: 180, unidadBandeja: 30 },
  { sku: "BLA 3ERA", nombre: "3era Blanco", tipo: "huevo", unidadCaja: 180, unidadBandeja: 30 },
  { sku: "BLA 4TA", nombre: "4ta Blanco", tipo: "huevo", unidadCaja: 180, unidadBandeja: 30 },
  { sku: "COL 4TA", nombre: "4ta Color", tipo: "huevo", unidadCaja: 180, unidadBandeja: 30 },
  { sku: "BLA MAN", nombre: "Manchado Blanco", tipo: "huevo", unidadCaja: 180, unidadBandeja: 30 },
  { sku: "COL MAN", nombre: "Manchado Color", tipo: "huevo", unidadCaja: 180, unidadBandeja: 30 },
  { sku: "BLA TRI", nombre: "Trizados Blanco", tipo: "huevo", unidadCaja: 180, unidadBandeja: 30 },
  { sku: "COL TRI", nombre: "Trizados Color", tipo: "huevo", unidadCaja: 180, unidadBandeja: 30 },
  { sku: "MERMA", nombre: "Merma", tipo: "merma", unidadCaja: 0, unidadBandeja: 0 },
  { sku: "DES", nombre: "Desecho", tipo: "desecho", unidadCaja: 0, unidadBandeja: 0 }
];

// --- Pabellones ---
export interface PabellonDef {
  id: string;
  nombre: string;
  activo: boolean;
}

export const PABELLONES: PabellonDef[] = [
  { id: "01", nombre: "Pabellón 1", activo: false },
  { id: "02", nombre: "Pabellón 2", activo: false },
  { id: "03", nombre: "Pabellón 3", activo: false },
  { id: "04", nombre: "Pabellón 4", activo: false },
  { id: "05", nombre: "Pabellón 5", activo: false },
  { id: "06", nombre: "Pabellón 6", activo: false },
  { id: "07", nombre: "Pabellón 7", activo: false },
  { id: "08", nombre: "Pabellón 8", activo: false },
  { id: "09", nombre: "Pabellón 9", activo: false },
  { id: "10", nombre: "Pabellón 10", activo: true },
  { id: "11", nombre: "Pabellón 11", activo: true },
  { id: "12", nombre: "Pabellón 12", activo: true },
  { id: "13", nombre: "Pabellón 13", activo: true },
  { id: "14", nombre: "Pabellón 14", activo: true },
  { id: "15", nombre: "Pabellón 15", activo: true },
  { id: "16", nombre: "Pabellón R2", activo: true }
];

// --- Estados de vales/movimientos ---
export type ValeEstado = "pendiente" | "validado" | "rechazado" | "anulado" | "en edición";

export const ESTADOS_VALE: { key: ValeEstado; label: string; color: string }[] = [
  { key: "pendiente", label: "Pendiente", color: "yellow" },
  { key: "validado", label: "Validado", color: "green" },
  { key: "rechazado", label: "Rechazado", color: "red" },
  { key: "anulado", label: "Anulado", color: "gray" },
  { key: "en edición", label: "En edición", color: "blue" }
];

// --- Tipos de usuario ---
export type UserRole = "superadmin" | "admin" | "bodega" | "packing" | "colaborador" | "lector";

export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  password: string;
  rol: UserRole;
  activo: boolean;
}

export const SUPERADMIN_EMAIL = "nijh@avgal.cl";
export const SUPERADMIN_PASS = "zzz111zzz";

export const USUARIOS: Usuario[] = [
  { id: 1, nombre: "Nicolas Jugo", correo: SUPERADMIN_EMAIL, password: SUPERADMIN_PASS, rol: "superadmin", activo: true },
  { id: 2, nombre: "Jose Miguel Jugo", correo: "jmjugo79@gmail.com", password: "abc", rol: "admin", activo: true },
  { id: 3, nombre: "Ximena Baladron", correo: "abc", password: "abc", rol: "admin", activo: true },
  { id: 4, nombre: "Fernando Jugo", correo: "ccc", password: "abc", rol: "admin", activo: true },
  { id: 5, nombre: "Willer Flores", correo: "aaa", password: "abc", rol: "admin", activo: true },
  { id: 6, nombre: "Oficina 1", correo: "bbb", password: "abc", rol: "bodega", activo: true },
  { id: 7, nombre: "Oficina 2", correo: "ccc", password: "abc", rol: "bodega", activo: true },
  { id: 8, nombre: "Oficina 3", correo: "ddd", password: "abc", rol: "packing", activo: true },
  { id: 9, nombre: "Bodega", correo: "eee", password: "abc", rol: "colaborador", activo: true },
  { id: 10, nombre: "Packing", correo: "fff", password: "abc", rol: "lector", activo: true },
  { id: 11, nombre: "Lector", correo: "ggg", password: "abc", rol: "colaborador", activo: true }
];

export function loginUsuario(email: string, pass: string) {
  if (email === SUPERADMIN_EMAIL && pass === SUPERADMIN_PASS) {
    return USUARIOS.find(u => u.rol === "superadmin");
  }
  return USUARIOS.find(u => u.correo === email && u.password === pass && u.activo);
}

// --- Destinos ---
export interface Destinos {
  id: number;
  nombre: string;
  solicita: string;
  transporte: string;
}

export const Destino: Destinos[] = [
  { id: 1, nombre: "Oficina", solicita: "AA", transporte: "ABC"},
  { id: 2, nombre: "Vendedores", solicita: "AA", transporte: "ABC"},
  { id: 3, nombre: "Local D.", solicita: "AA", transporte: "ABC"},
  { id: 4, nombre: "Local R.", solicita: "AA", transporte: "ABC"},
  { id: 5, nombre: "Limpieza", solicita: "AA", transporte: "ABC"},
  { id: 6, nombre: "Ración", solicita: "AA", transporte: "ABC"},
  { id: 7, nombre: "Fecha", solicita: "AA", transporte: "ABC"},
  { id: 8, nombre: "Otro", solicita: "AA", transporte: "ABC"},
];

export interface Origen {
  id: number;
  nombre: string;
}

export const Origen: Origen[] = [
  { id: 1, nombre: "Devolucion Vendedores"},
  { id: 2, nombre: "Instruccion oficina"},
  { id: 3, nombre: "otro"},

];




// --- Transportistas ---
export interface Transportista {
  id: number;
  nombre: string;
  vehiculo: string;
  patente: string;
  observacion?: string;
}

export const TRANSPORTISTAS: Transportista[] = [
  { id: 1, nombre: "Chofer 1", vehiculo: "Furgon", patente: "AABB22", observacion: "Externo" },
  { id: 2, nombre: "Chofer 2", vehiculo: "Furgon", patente: "ZZZZ55", observacion: "ABC" }
];

// Pabelloneros
export const PABELLONEROS = [
  { id: 1, pabellon: "13", nombre: "Miguel Vz" },
  { id: 2, pabellon: "14", nombre: "Juan X" },
  { id: 3, pabellon: "15", nombre: "Don Miguel" }
];

// --- Contadores ---
export interface ContadorDef {
  id: number;
  nombre: string;
  pabellon: string;
  linea: "A" | "B" | "C";
  cara: 1 | 2;
}

export const CONTADORES: ContadorDef[] = [
  { id: 1, nombre: "C1", pabellon: "14", linea: "A", cara: 1 },
  { id: 2, nombre: "C2", pabellon: "14", linea: "A", cara: 2 },
  { id: 3, nombre: "C3", pabellon: "14", linea: "B", cara: 1 },
  { id: 4, nombre: "C4", pabellon: "14", linea: "B", cara: 2 },
  { id: 5, nombre: "C5", pabellon: "14", linea: "C", cara: 1 },
  { id: 6, nombre: "C6", pabellon: "14", linea: "C", cara: 2 },
  { id: 7, nombre: "C7", pabellon: "13", linea: "A", cara: 1 },
  { id: 8, nombre: "C8", pabellon: "13", linea: "A", cara: 2 },
  { id: 9, nombre: "C9", pabellon: "13", linea: "B", cara: 1 },
  { id: 10, nombre: "C10", pabellon: "13", linea: "B", cara: 2 },
  { id: 11, nombre: "C11", pabellon: "13", linea: "C", cara: 1 },
  { id: 12, nombre: "C12", pabellon: "13", linea: "C", cara: 2 },
  { id: 13, nombre: "C13", pabellon: "15", linea: "A", cara: 1 },
  { id: 14, nombre: "C14", pabellon: "15", linea: "A", cara: 2 },
  { id: 15, nombre: "C15", pabellon: "15", linea: "B", cara: 1 },
  { id: 16, nombre: "C16", pabellon: "15", linea: "B", cara: 2 },
  { id: 17, nombre: "C17", pabellon: "15", linea: "C", cara: 1 },
  { id: 18, nombre: "C18", pabellon: "15", linea: "C", cara: 2 }
];

// --- Colores UI ---
export const MOVIMIENTO_COLORS: Record<string, string> = {
  Ingreso: "green",
  Egreso: "red",
  Merma: "yellow",
  Validado: "green",
  Pendiente: "yellow",
  Anulado: "gray"
};

export const getSkuInfo = (sku: string) => SKUS.find(s => s.sku === sku);
export const DATE_FORMAT = "DD/MM/YYYY";
export const DATE_FORMAT_API = "YYYY-MM-DD";

// --- Packing detalle y vale ---
export interface packingdetalle {
  sku: string;
  cajas: number;
  bandejas: number;
  unidades: number;
  totalunidades: number;
}

// --- Vale de Ingreso desde Packing a Bodega ---
export interface valeingresopacking {
  id: number;
  fecha: string;
  pabellonid: string;
  pabellonnombre: string;
  operadorid: number;
  operadornombre: string;
  detalles: packingdetalle[];
  totalunidadesempaquetadas: number;
  estado: ValeEstado;
  observaciones?: string;
  fechacreacion: string;
  validadopor?: number;
  fechavalidacion?: string;
}

// helpers
export const calculartotalunidades = (
  sku: string,
  cajas: number,
  bandejas: number,
  unidades: number
): number => {
  const info = SKUS.find(s => s.sku === sku);
  if (!info) return 0;
  return cajas * info.unidadCaja + bandejas * info.unidadBandeja + unidades;
};

export const getpabellonesactivos = () => PABELLONES.filter(p => p.activo);

// --- Packing Mocks ---
export const valespackingmock: valeingresopacking[] = [
  {
    id: 1,
    fecha: "2025-10-21",
    pabellonid: "14",
    pabellonnombre: "Pabellón 14",
    operadorid: 10,
    operadornombre: "Packing",
    detalles: [
      {
        sku: "BLA EXTRA",
        cajas: 50,
        bandejas: 10,
        unidades: 25,
        totalunidades: calculartotalunidades("BLA EXTRA", 50, 10, 25)
      }
    ],
    totalunidadesempaquetadas: calculartotalunidades("BLA EXTRA", 50, 10, 25),
    estado: "validado",
    observaciones: "producción normal",
    fechacreacion: "2025-10-21T08:00:00",
    validadopor: 1,
    fechavalidacion: "2025-10-21T13:00:00"
  }
];




// --- BODEGA ---
export interface BodegaStock {
  sku: string;
  totalunidades: number;
  cajas: number;
  bandejas: number;
  unidades: number;
}

export interface ValeBodega {
  id: number;
  fecha: string;
  operadorid: number;
  operadornombre: string;
  detalles: packingdetalle[];
  estado: ValeEstado;
  observaciones?: string;
  pabellonid?: string;
  pabellonnombre?: string;
}

export interface MovimientoBodega {
  id: number;
  fecha: string;
  tipo: "ingreso" | "egreso" | "reingreso" | "ajuste";
  sku: string;
  cajas: number;
  bandejas: number;
  unidades: number;
  totalunidades: number;
  estado: ValeEstado;
  pabellon?: string;
  operador?: string;
  observacion?: string;
}

export const bodegamock: BodegaStock[] = [
  { sku: "BLA EXTRA", totalunidades: 14200, cajas: 60, bandejas: 10, unidades: 20 },
  { sku: "COL 2DA", totalunidades: 2900, cajas: 15, bandejas: 3, unidades: 40 },
  { sku: "BLA MAN", totalunidades: 120, cajas: 0, bandejas: 1, unidades: 20 }
];

export const valespendientesmock: ValeBodega[] = [
  {
    id: 1123,
    fecha: "2025-10-21",
    operadorid: 10,
    operadornombre: "Packing 1",
    detalles: [
      { sku: "COL 2DA", cajas: 15, bandejas: 3, unidades: 40, totalunidades: 2900 }
    ],
    estado: "pendiente",
    observaciones: "Vale importado en la mañana",
    pabellonid: "11",
    pabellonnombre: "Pabellón 11"
  }
];

export const movimientosmock: MovimientoBodega[] = [
  {
    id: 93,
    fecha: "2025-10-20",
    tipo: "egreso",
    sku: "BLA EXTRA",
    cajas: 5,
    bandejas: 0,
    unidades: 0,
    totalunidades: 900,
    estado: "validado",
    pabellon: "10",
    operador: "JM Jugo",
    observacion: "Salida cliente X"
  },
  {
    id: 120,
    fecha: "2025-10-21",
    tipo: "ingreso",
    sku: "BLA JUM",
    cajas: 3,
    bandejas: 1,
    unidades: 0,
    totalunidades: 320,
    estado: "validado",
    pabellon: "12",
    operador: "Oficina 1"
  },
  {
    id: 121,
    fecha: "2025-10-21",
    tipo: "reingreso",
    sku: "BLA MAN",
    cajas: 1,
    bandejas: 0,
    unidades: 10,
    totalunidades: 10,
    estado: "pendiente",
    pabellon: "13",
    operador: "Oficina 3"
  }
];
