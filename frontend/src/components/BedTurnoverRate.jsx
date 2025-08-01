import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

const BedTurnoverRate = ({ stats }) => {
  if (!stats) return null;

  const turnoverValue = parseFloat(stats.turnoverRate || 0);
  const totalBeds = stats.totalBeds || 0;
  const discharges = stats.discharges || 0;

  const chartData = [
    { name: 'Used', value: turnoverValue },
    { name: 'Unused', value: 100 - turnoverValue },
  ];

  const COLORS = ['#F59E0B', '#E5E7EB']; // Yellow and light gray

  return (
    <div className="bg-white p-6 rounded-2xl hover:shadow-md border w-full max-w-xl">
      <h2 className="text-2xl font-semibold text-yellow-600 mb-6">🔄 Bed Turnover Rate</h2>

      <div className="flex items-center gap-6">
        {/* Circular Chart */}
        <div className="w-36 h-36">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Stats Info */}
        <div className="flex flex-col gap-2 text-gray-700 text-base">
          <div>
            <span className="font-semibold text-gray-500">Turnover Rate:</span>{' '}
            <span className="text-yellow-600 font-bold">{turnoverValue}%</span>
          </div>
          <div>
            <span className="font-semibold text-gray-500">Total Beds:</span>{' '}
            <span className="font-medium">{totalBeds}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-500">Discharges:</span>{' '}
            <span className="font-medium">{discharges}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BedTurnoverRate;
