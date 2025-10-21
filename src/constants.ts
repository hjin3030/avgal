// --- SKUS de productos/stock ---
export interface SkuDef {
  sku: string;
  nombre: string;
  tipo: "huevo" | "merma" | "desecho" | "otro";
  unidadCaja: number;
  unidadBandeja: number;
  color?: string; // para UI
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

// --- Tipos de usuario y usuarios principales ---
export type UserRole = "superadmin" | "admin" | "operario" | "bodeguero" | "supervisor";

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
  { id: 6, nombre: "Oficina 1", correo: "bbb", password: "abc", rol: "operario", activo: true },
  { id: 7, nombre: "Oficina 2", correo: "ccc", password: "abc", rol: "operario", activo: true },
  { id: 8, nombre: "Oficina 3", correo: "ddd", password: "abc", rol: "operario", activo: true },
  { id: 9, nombre: "Bodega", correo: "eee", password: "abc", rol: "bodeguero", activo: true },
  { id: 10, nombre: "Packing", correo: "fff", password: "abc", rol: "operario", activo: true },
  { id: 11, nombre: "Lector", correo: "ggg", password: "abc", rol: "operario", activo: true }
];

// --- Helper universal para login ---
export function loginUsuario(email: string, pass: string) {
  if (email === SUPERADMIN_EMAIL && pass === SUPERADMIN_PASS) {
    return USUARIOS.find(u => u.rol === "superadmin");
  }
  return USUARIOS.find(u => u.correo === email && u.password === pass && u.activo);
}

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
  { id: 2, nombre: "Chofer 2", vehiculo: "Furgon", patente: "ZZZZ55", observacion: "ABC" },
];

// --- Contadores y su asignación por pabellón, línea y cara ---
export interface ContadorDef {
  id: number;
  nombre: string;
  pabellon: string;
  linea: "A" | "B" | "C";
  cara: 1 | 2;
}

export const CONTADORES: ContadorDef[] = [
  { id: 1, nombre: "A1", pabellon: "14", linea: "A", cara: 1 },
  { id: 2, nombre: "A2", pabellon: "14", linea: "A", cara: 2 },
  { id: 3, nombre: "B1", pabellon: "14", linea: "B", cara: 1 },
  { id: 4, nombre: "B2", pabellon: "14", linea: "B", cara: 2 },
  { id: 5, nombre: "C1", pabellon: "14", linea: "C", cara: 1 },
  { id: 6, nombre: "C2", pabellon: "14", linea: "C", cara: 2 },
  { id: 7, nombre: "A1", pabellon: "13", linea: "A", cara: 1 },
  { id: 8, nombre: "A2", pabellon: "13", linea: "A", cara: 2 },
  { id: 9, nombre: "B1", pabellon: "13", linea: "B", cara: 1 },
  { id: 10, nombre: "B2", pabellon: "13", linea: "B", cara: 2 },
  { id: 11, nombre: "C1", pabellon: "13", linea: "C", cara: 1 },
  { id: 12, nombre: "C2", pabellon: "13", linea: "C", cara: 2 },
  { id: 13, nombre: "A1", pabellon: "15", linea: "A", cara: 1 },
  { id: 14, nombre: "A2", pabellon: "15", linea: "A", cara: 2 },
  { id: 15, nombre: "B1", pabellon: "15", linea: "B", cara: 1 },
  { id: 16, nombre: "B2", pabellon: "15", linea: "B", cara: 2 },
  { id: 17, nombre: "C1", pabellon: "15", linea: "C", cara: 1 },
  { id: 18, nombre: "C2", pabellon: "15", linea: "C", cara: 2 }
];

// --- Etiquetas UI por tipo movimiento ---
export const MOVIMIENTO_COLORS: Record<string, string> = {
  Ingreso: "green",
  Egreso: "red",
  Merma: "yellow",
  Validado: "green",
  Pendiente: "yellow",
  Anulado: "gray"
};

// --- Helpers para SKUs ---
export const getSkuInfo = (sku: string) => SKUS.find(s => s.sku === sku);

// --- Fechas por defecto y formato base ---
export const DATE_FORMAT = "DD/MM/YYYY";
export const DATE_FORMAT_API = "YYYY-MM-DD";

// --- Lugar donde puedes seguir agregando catálogos ---
