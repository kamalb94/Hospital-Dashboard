import axios from 'axios';
import { useEffect, useState } from 'react';

const RecentPatients = () => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchRecentPatients = async () => {
      try {
        const res = await axios.get('http://localhost:4580/api/v1/appointment/recent-patients');
        setPatients(res.data);
      } catch (err) {
        console.error('Failed to fetch recent patients:', err);
      }
    };

    fetchRecentPatients();
  }, []);

  return (
    <div className="w-full bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Recent Patients</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="text-left text-sm text-gray-600">
              <th className="py-2">Name</th>
              <th className="py-2">Gender</th>
              <th className="py-2">Blood Group</th>
              <th className="py-2">Disease</th>
              <th className="py-2">Date</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((appointment, index) => {
              const user = appointment.patient?.user;
              const patient = appointment.patient;
              const appointmentDate = new Date(appointment.appointmentDate);
              const formattedDate = appointmentDate.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
              });

              return (
                <tr key={index} className="border-t text-sm text-gray-800">
                  <td className="py-3 flex items-center gap-3">
                    <img
                      src={user?.profileImage || '/default-avatar.png'}
                      alt={user?.fullName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span>{user?.fullName}</span>
                  </td>
                  <td className="py-3">{user?.gender}</td>
                  <td className="py-3">{user?.bloodGroup || '-'}</td>
                  <td className="py-3">{appointment.reason || '-'}</td>
                  <td className="py-3">{formattedDate}</td>
                  <td className="py-3">{appointment.status || '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentPatients;
