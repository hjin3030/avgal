const AlertPanel = () => (
  <div className="flex flex-wrap gap-3 mb-6">
    <span className="bg-yellow-200 text-yellow-900 px-4 py-1 rounded-full border font-medium border-yellow-400 flex items-center gap-2">
      Falta ingreso de contador Pab. 1
      <button className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded" onClick={()=>window.location.href='/produccion'}>
        Ver contadores
      </button>
    </span>
    <span className="bg-yellow-200 text-yellow-900 px-4 py-1 rounded-full border font-medium border-yellow-400 flex items-center gap-2">
      2 vales pendientes
      <button className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded" onClick={()=>window.location.href='/bodega'}>
        Ver vales
      </button>
    </span>
  </div>
);
export default AlertPanel;
