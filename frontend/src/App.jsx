import axios from 'axios';
import { useEffect, useState } from 'react';
import AdmissionGrowthRate from './components/AdmissiongrowthRate';
import BedOccupancyTrend from './components/BedOccupencyTrend';
import BedTurnoverRate from './components/BedTurnOverRate';
import DoctorLoad from './components/DoctorLoad';
import DoctorUtilization from './components/DoctorUtilization';
import HeroStats from './components/HeroStats';
import RecentPatients from './components/RecentPatients';

function App() {
  const [bedTrend, setBedTrend] = useState([]);
  const [doctorStats, setDoctorStats] = useState(null);
  const [turnoverStats, setTurnoverStats] = useState(null);
  const [doctorLoadStats, setDoctorLoadStats] = useState(null);
  const [noShowStats, setNoShowStats] = useState(null);
  const [quote, setQuote] = useState('');

  const quotes = [
    "Every patient matters, every moment counts.",
    "Healing is a matter of time, but also a matter of care.",
    "Where compassion meets excellence.",
    "Committed to care. Dedicated to healing.",
    "In this hospital, hope is not just a word—it’s our culture."
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bedTrendRes, doctorStatsRes, turnoverStatsRes, doctorLoadStatsRes, noShowStatsRes] = await Promise.all([
          axios.get('http://localhost:4580/api/v1/analytics/bed-occupancy-trend'),
          axios.get('http://localhost:4580/api/v1/analytics/doctor-utilization'),
          axios.get('http://localhost:4580/api/v1/analytics/bed-turnover-rate'),
          axios.get('http://localhost:4580/api/v1/analytics/doctor-load'),
          axios.get('http://localhost:4580/api/v1/analytics/no-show-rate')
        ]);

        setBedTrend(bedTrendRes.data);
        setDoctorStats(doctorStatsRes.data);
        setTurnoverStats(turnoverStatsRes.data);
        setDoctorLoadStats(doctorLoadStatsRes.data);
        setNoShowStats(noShowStatsRes.data);

        const random = Math.floor(Math.random() * quotes.length);
        setQuote(quotes[random]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-white p-6">
      

      <section className='h-52 w-full mb-10 flex bg-gradient-to-r from-emerald-500 via-white to-white'>
       
        <div className='w-[70%]'>
         <h1 className="w-full text-xl font-bold mb-8 text-white p-4">Hospital Dashboard</h1>
        </div>
         <div className="bg-white p-6 rounded-xl">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">💡 Today Quote</h2>
            <p className="italic text-gray-600">"{quote}"</p>
          </div>
      </section>
        <HeroStats/>
        

      <div className="">
        
        {/* Left/Main Content */}
        <div className="flex justify-between gap-6">
          <AdmissionGrowthRate />
          <BedTurnoverRate stats={turnoverStats} />
          <DoctorUtilization stats={doctorStats}/>
          
          
          
        </div>

        {/* Right Sidebar */}
        <div className="flex flex-col gap-6 mt-10">
          <div className='flex gap-5'>
            <BedOccupancyTrend data={bedTrend} />
          
          
          <DoctorLoad stats={doctorLoadStats} />
          </div>

          <div className='flex gap-5'>
            {noShowStats && (
            <div className="w-full h-fit bg-white p-6 rounded-xl hover:shadow border">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Appointment Insights</h2>
              <div className="space-y-2">
                <p><span className="font-semibold text-blue-600">Total Appointments:</span> {noShowStats.totalAppointments}</p>
                <p><span className="font-semibold text-red-500">Missed Appointments:</span> {noShowStats.missedAppointments}</p>
                <p><span className="font-semibold text-purple-600">No-Show Rate:</span> {noShowStats.noShowRate}%</p>
              </div>
            </div>
          )}
          <RecentPatients/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
