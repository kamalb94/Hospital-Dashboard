import axios from 'axios';
import {
    BedDouble,
    CalendarDays,
    Stethoscope,
    Users
} from 'lucide-react';
import { useEffect, useState } from 'react';

function HeroStats() {
  const [patientCount, setPatientCount] = useState(null);
  const [doctorCount, setDoctorCount] = useState(null);
  const [appointmentsCount, setAppointmentsCount] = useState(null);

  // Fetch patients and doctors
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsRes, doctorsRes, appointmentsRes] = await Promise.all([
          axios.get('http://localhost:4580/api/v1/patient'),
          axios.get('http://localhost:4580/api/v1/doctor'),
          axios.get('http://localhost:4580/api/v1/appointment/last-7days'),
          
        ]);

        setPatientCount(patientsRes.data?.length ?? 0);
        setDoctorCount(doctorsRes.data?.length ?? 0);
        setAppointmentsCount(appointmentsRes.data?.length ?? 0);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setPatientCount(0);
        setDoctorCount(0);
      }
    };

    fetchData();
  }, []);

  const stats = [
    {
      title: 'Patients',
      icon: <Users className="text-blue-600 w-6 h-6" />,
      count: patientCount !== null ? patientCount : '...',
      subtitle: 'our patients',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Doctors',
      icon: <Stethoscope className="text-green-600 w-6 h-6" />,
      count: doctorCount !== null ? doctorCount : '...',
      subtitle: 'our doctors',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Appointments',
      icon: <CalendarDays className="text-yellow-600 w-6 h-6" />,
      count: appointmentsCount !== null ? appointmentsCount : '---',
      subtitle: 'Appointments in last 7 days',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'Beds Assigned',
      icon: <BedDouble className="text-purple-600 w-6 h-6" />,
      count: '26',
      subtitle: 'Beds assigned in last 7 days',
      bgColor: 'bg-purple-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((item, idx) => (
        <div
          key={idx}
          className="flex items-center bg-white p-4 rounded-xl border hover:shadow-md transition-shadow"
        >
          <div
            className={`p-3 rounded-full ${item.bgColor} flex items-center justify-center mr-4`}
          >
            {item.icon}
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-800">{item.count}</div>
            <div className="text-sm text-gray-500">{item.subtitle}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default HeroStats;
