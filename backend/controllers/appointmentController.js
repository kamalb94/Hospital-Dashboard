const { Op } = require("sequelize");
const { Appointment, Patient, User } = require("../models");

const getAllAppointments = async(req, res) => {
    try{
        const appointments = await Appointment.findAll()

        return res.status(200).json(appointments);
    }catch(err){
        console.log(err);
    }
}

const getLast7DaysAppointments = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Fetch only appointments from the last 7 days
    const recentAppointments = await Appointment.findAll({
      where: {
        appointmentDate: {
          [Op.gte]: sevenDaysAgo
        }
      }
    });

    return res.status(200).json(recentAppointments);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Failed to fetch appointments' });
  }
};

const getRecentAppointmentsWithPatientDetails = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      order: [['appointmentDate', 'DESC'], ['reason', 'ASC']],
      limit: 10,
    });

    const patientIds = [...new Set(appointments.map((a) => a.patientId))];

    const patients = await Patient.findAll({
      where: {
        id: {
          [Op.in]: patientIds,
        },
      },
      include: {
        model: User,
        as: 'user',
        attributes: ['fullName', 'gender', 'profileImage', 'bloodGroup'],
      },
    });

    const patientMap = {};
    patients.forEach((patient) => {
      patientMap[patient.id] = {
        ...patient.toJSON(),
      };
    });

    const enrichedAppointments = appointments.map((appointment) => ({
      ...appointment.toJSON(),
      patient: patientMap[appointment.patientId] || null,
    }));

    return res.status(200).json(enrichedAppointments);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to fetch enriched appointments' });
  }
};

const wipeAppointmentsData = async (req, res) => {
  try {
    // Delete all rows from the 'doctors' table
    const deletedCount = await Appointment.destroy({
      where: {},  // Empty condition deletes all rows
    });

    // Check if rows were deleted
    if (deletedCount === 0) {
      return res.status(404).json({ message: 'No appointments found to delete' });
    }

    return res.status(200).json({ message: `Successfully deleted ${deletedCount} appointments from the database` });
  } catch (error) {
    console.error('Error deleting appointments:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const updateAppointmentDates = async () => {
  const allAppointments = await Appointment.findAll();

  const now = new Date();
  const startPast = new Date('2025-04-01');
  const endPast = new Date('2025-07-31');
  const startFuture = new Date('2025-08-01');
  const endFuture = new Date('2025-10-31');

  for (let i = 0; i < allAppointments.length; i++) {
    let newDate;

    // Let's say 80% of appointments go to past, 20% to future
    const isPast = Math.random() < 0.8;

    if (isPast) {
      newDate = new Date(startPast.getTime() + Math.random() * (endPast.getTime() - startPast.getTime()));
    } else {
      newDate = new Date(startFuture.getTime() + Math.random() * (endFuture.getTime() - startFuture.getTime()));
    }

    await allAppointments[i].update({
      appointmentDate: newDate,
    });
  }

  console.log('Appointment dates updated.');
};

module.exports = {getAllAppointments, wipeAppointmentsData, updateAppointmentDates, getLast7DaysAppointments, getRecentAppointmentsWithPatientDetails};