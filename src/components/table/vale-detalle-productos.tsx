import type { packingdetalle } from "../../constants";

type props = {
  detalles: packingdetalle[];
};

const valedetalleproductos = ({ detalles }: props) => (
  <table className="w-full mt-2 border">
    <thead className="bg-gray-50 text-xs uppercase">
      <tr>
        <th className="px-2 py-2">SKU</th>
        <th className="px-2 py-2">Cantidad</th>
        <th className="px-2 py-2">Desglose</th>
      </tr>
    </thead>
    <tbody>
      {detalles.map((prod, idx) =>
        <tr key={prod.sku + idx}>
          <td className="px-2 py-2">{prod.sku}</td>
          <td className="px-2 py-2">{prod.totalunidades.toLocaleString()} U</td>
          <td className="px-2 py-2">{prod.cajas}C, {prod.bandejas}B, {prod.unidades}U</td>
        </tr>
      )}
    </tbody>
  </table>
);

export default valedetalleproductos;
