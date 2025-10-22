import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard/dashboard";
import Packing from "./pages/packing/packing";
import Bodega from "./pages/bodega/bodega";
import Produccion from "./pages/produccion/produccion";
import Reportes from "./pages/reportes/reportes";
import Configuracion from "./pages/configuracion/configuracion";
import HistorialContadores from "./pages/historial-contadores";
import HistorialBalde from "./pages/historial-balde";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/packing" element={<Packing />} />
        <Route path="/bodega" element={<Bodega />} />
        <Route path="/produccion" element={<Produccion />} />
        <Route path="/reportes" element={<Reportes />} />
        <Route path="/configuracion" element={<Configuracion />} />
        <Route path="/historial-contadores" element={<HistorialContadores />} />
        <Route path="/historial-balde" element={<HistorialBalde />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
