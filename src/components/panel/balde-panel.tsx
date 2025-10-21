const BaldePanel = ({ baldes }: { baldes: { fecha: string, peso: number }[] }) => (
  <div className="bg-white rounded-xl shadow-lg p-4 mb-8 w-full">
    <h3 className="text-sm font-bold mb-2 text-gray-700">Peso balde (merma)</h3>
    <ul>
      {baldes.map((b,i)=>
        <li key={i} className="flex justify-between border-b py-2">
          <span>{b.fecha}</span>
          <span className="font-bold text-blue-700">{b.peso} kg</span>
        </li>
      )}
    </ul>
    <button className="mt-3 px-3 py-1 bg-indigo-500 text-white rounded text-xs"
      onClick={()=>window.location.href='/reportes'}
    >Ver más</button>
  </div>
);
export default BaldePanel;
