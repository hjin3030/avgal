const Sidebar = () => (
  <aside className="bg-white shadow-md h-screen w-56 fixed top-0 left-0 flex flex-col py-4 z-40">
    <div className="px-6 py-4 text-blue-700 font-bold text-lg tracking-wide">AVGAL</div>
    <nav className="flex-1 px-6 mt-8 flex flex-col gap-2">
      <a href="/" className="text-gray-600 hover:bg-blue-50 py-2 px-3 rounded transition">Dashboard</a>
      <a href="/packing" className="text-gray-600 hover:bg-blue-50 py-2 px-3 rounded transition">Packing</a>
      <a href="/bodega" className="text-gray-600 hover:bg-blue-50 py-2 px-3 rounded transition">Bodega</a>
      <a href="/produccion" className="text-gray-600 hover:bg-blue-50 py-2 px-3 rounded transition">Producción</a>
      <a href="/reportes" className="text-gray-600 hover:bg-blue-50 py-2 px-3 rounded transition">Reportes</a>
      <a href="/configuracion" className="text-gray-600 hover:bg-blue-50 py-2 px-3 rounded transition">Config.</a>
    </nav>
  </aside>
);
export default Sidebar;
