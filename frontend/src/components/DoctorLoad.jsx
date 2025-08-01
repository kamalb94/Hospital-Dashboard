import axios from 'axios';
import { useEffect, useState } from 'react';
import {
    Bar,
    BarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';

const DoctorLoad = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchDoctorLoad = async () => {
      try {
        const res = await axios.get('http://localhost:4580/api/v1/analytics/doctor-load');
        const rawData = res.data;

        // Group appointment counts by specialization
        const grouped = rawData.reduce((acc, item) => {
          const specialization = item.doctor?.specialization || 'Unknown';
          acc[specialization] = (acc[specialization] || 0) + item.appointmentCount;
          return acc;
        }, {});

        console.log('grouped', grouped);

        // Convert to array for chart
        const processed = Object.entries(grouped).map(([specialization, count]) => ({
          name: specialization,
          Appointments: count,
        }));

        setChartData(processed);
      } catch (error) {
        console.error('Error fetching doctor load:', error);
      }
    };

    fetchDoctorLoad();
  }, []);

  return (
    <section className="w-full hover:shadow-md border rounded-2xl p-4">
      <h2 className="text-xl font-semibold mb-4">Doctor Load by Specialization</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" stroke="#4B5563" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="Appointments" fill="#10B981" barSize={35} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
};

export default DoctorLoad;
