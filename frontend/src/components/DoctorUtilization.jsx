function DoctorUtilization({ stats }) {
  if (!stats) return null;

  return (
    <div className="w-full bg-white p-6 rounded-2xl border hover:shadow-md transition-shadow duration-200">
      <h2 className="text-2xl font-semibold mb-4">Doctor Utilization</h2>
      <div className="text-gray-700 space-y-2">
        <p>
          <strong>Total Doctors:</strong>{' '}
          <span className="font-medium">{stats.totalDoctors}</span>
        </p>
        <p>
          <strong>Total Appointments:</strong>{' '}
          <span className="font-medium">{stats.totalAppointments}</span>
        </p>
        <p>
          <strong>Avg. Appointments/Doctor:</strong>{' '}
          <span className="font-medium">{stats.avgAppointmentsPerDoctor}</span>
        </p>
      </div>
    </div>
  );
}

export default DoctorUtilization;