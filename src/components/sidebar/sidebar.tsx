import { FiHome, FiPackage, FiBox, FiTrendingUp, FiFileText, FiSettings } from "react-icons/fi";

const Sidebar = () => {
  const currentPath = window.location.pathname;

  const links = [
    { name: "Dashboard", path: "/", icon: <FiHome size={18} /> },
    { name: "Packing", path: "/packing", icon: <FiPackage size={18} /> },
    { name: "Bodega", path: "/bodega", icon: <FiBox size={18} /> },
    { name: "Producción", path: "/produccion", icon: <FiTrendingUp size={18} /> },
    { name: "Reportes", path: "/reportes", icon: <FiFileText size={18} /> },
    { name: "Config.", path: "/configuracion", icon: <FiSettings size={18} /> }
  ];

  return (
    <aside className="bg-white shadow-md h-screen w-56 fixed top-0 left-0 flex flex-col py-4 z-40">
      <div className="px-6 py-4 text-blue-700 font-bold text-lg tracking-wide">AVGAL</div>
      <nav className="flex-1 px-6 mt-8 flex flex-col gap-2">
        {links.map((link) => (
          <a
            key={link.path}
            href={link.path}
            className={`flex items-center gap-3 py-2 px-3 rounded transition ${
              currentPath === link.path
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-blue-50"
            }`}
          >
            {link.icon}
            <span>{link.name}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
