type Props = { title: string; value: number | string; percent: string; color: string; icon?: React.ReactNode; }
const KpiCard = ({ title, value, percent, color, icon }: Props) => (
  <div className={`flex items-center gap-4 rounded-xl shadow p-5 ${color} min-w-[230px]`}>
    <div className="flex items-center justify-center rounded-full w-10 h-10 bg-white">
      {icon}
    </div>
    <div>
      <div className="text-sm text-gray-500 font-semibold">{title}</div>
      <div className="text-2xl font-bold text-gray-800">{value} <span className="text-xs text-green-600 ml-2">{percent}</span></div>
    </div>
  </div>
);
export default KpiCard;
