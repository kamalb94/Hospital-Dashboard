import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

function BedOccupancyTrend({ data }) {
  return (
    <div className="w-full bg-white p-4 rounded-xl border hover:shadow-md">
      <h2 className="text-xl font-semibold mb-2">Bed Occupancy Trend</h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis unit="%" />
          <Tooltip />
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <Line type="monotone" dataKey="occupancyRate" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BedOccupancyTrend;