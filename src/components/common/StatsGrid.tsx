export default function StatsGrid({ stats }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      {stats.map((s: any, i: number) => (
        <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{s.label}</p>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            </div>
            <div className={`p-3 rounded-full ${s.bg}`}>
              <s.icon className={`h-6 w-6 ${s.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
