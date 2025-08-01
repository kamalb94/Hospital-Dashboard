// controllers/analyticsController.js
const { Op, fn, col, literal, Sequelize } = require("sequelize");
const { Patient, Appointment, Bed, Room, Doctor, sequelize } = require("../models");

// 1. Daily and Weekly Patient Admissions and Discharges
const getAdmissionsDischarges = async (req, res) => {
  try {
    const admissions = await Patient.findAll({
      attributes: [
        [literal("CONVERT(date, admissionDate)"), "date"],
        [fn("COUNT", col("id")), "admissions"],
      ],
      where: {
        admissionDate: {
          [Op.gte]: literal("DATEADD(DAY, -7, GETDATE())"),
        },
      },
      group: [literal("CONVERT(date, admissionDate)")],
      order: [literal("CONVERT(date, admissionDate) ASC")],
      raw: true,
    });

    const discharges = await Patient.findAll({
      attributes: [
        [literal("CONVERT(date, dischargeDate)"), "date"],
        [fn("COUNT", col("id")), "discharges"],
      ],
      where: {
        dischargeDate: {
          [Op.gte]: literal("DATEADD(DAY, -7, GETDATE())"),
        },
      },
      group: [literal("CONVERT(date, dischargeDate)")],
      order: [literal("CONVERT(date, dischargeDate) ASC")],
      raw: true,
    });

    res.json({ admissions, discharges });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};



// 2. Room Occupancy Rate
const getRoomOccupancy = async (req, res) => {
  try {
    const rooms = await Room.findAll({
      include: [
        {
          model: Bed,
          as: "beds", // 👈 use the alias defined in the association
          attributes: ['id', 'bedNumber', "status"],
        },
      ],
    });

    console.log('rooms', rooms);

    const result = rooms.map((room) => {
      const total = room.beds.length; // 👈 use alias again here
      const occupied = room.beds.filter((bed) => bed.status === "Occupied").length;
      const occupancyRate = total ? (occupied / total) * 100 : 0;
      return {
        roomNumber: room.roomNumber,
        totalBeds: total,
        occupiedBeds: occupied,
        occupancyRate: occupancyRate.toFixed(2),
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// 3. Appointments Breakdown
const getAppointmentsBreakdown = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today

    // 7 days ago
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6); // include today as the 7th day

    // 30 days ago
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 29); // include today as the 30th day

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Appointments for today
    const todayAppointments = await Appointment.count({
      where: {
        appointmentDate: {
          [Op.gte]: today,
          [Op.lt]: tomorrow,
        },
      },
    });

    // Appointments in last 7 days (including today)
    const weeklyAppointments = await Appointment.count({
      where: {
        appointmentDate: {
          [Op.between]: [sevenDaysAgo, tomorrow],
        },
      },
    });

    // Appointments in last 30 days (including today)
    const monthlyAppointments = await Appointment.count({
      where: {
        appointmentDate: {
          [Op.between]: [thirtyDaysAgo, tomorrow],
        },
      },
    });

    // Appointments in future (after today)
    const upcomingAppointments = await Appointment.count({
      where: {
        appointmentDate: {
          [Op.gt]: tomorrow,
        },
      },
    });

    res.json({
      todayAppointments,
      weeklyAppointments,
      monthlyAppointments,
      upcomingAppointments,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// 4. Doctor Load (patients assigned per doctor)
const getDoctorLoad = async (req, res) => {
  try {
    const today = new Date();
    const last30Days = new Date();
    last30Days.setDate(today.getDate() - 30);

    const data = await Appointment.findAll({
      attributes: [
        'doctorId',
        [Sequelize.fn('COUNT', Sequelize.col('Appointment.id')), 'appointmentCount'],
      ],
      include: [
        {
          model: Doctor,
          as: 'doctor', // Must match your alias in associations
          attributes: ['id', 'specialization'],
        },
      ],
      where: {
        appointmentDate: {
          [Op.between]: [last30Days, today],
        },
      },
      group: ['doctorId', 'doctor.id', 'doctor.specialization'],
    });

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};



// 5. Bed Turnover Rate
const getBedTurnoverRate = async (req, res) => {
  try {
    const discharges = await Patient.count({
      where: {
        dischargeDate: {
          [Op.gte]: literal("DATEADD(DAY, -7, GETDATE())"), // correct for MSSQL
        },
      },
    });

    const totalBeds = await Bed.count();
    const turnoverRate = totalBeds > 0 ? (discharges / totalBeds) * 100 : 0;

    res.json({
      discharges,
      totalBeds,
      turnoverRate: turnoverRate.toFixed(2),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAdmissionGrowthRate = async (req, res) => {
  try {
    const thisWeekAdmissions = await Patient.count({
      where: {
        admissionDate: {
          [Op.between]: [
            literal("DATEADD(DAY, -6, CAST(GETDATE() AS DATE))"),
            literal("CAST(GETDATE() AS DATE)")
          ],
        },
      },
    });

    const lastWeekAdmissions = await Patient.count({
      where: {
        admissionDate: {
          [Op.between]: [
            literal("DATEADD(DAY, -13, CAST(GETDATE() AS DATE))"),
            literal("DATEADD(DAY, -7, CAST(GETDATE() AS DATE))")
          ],
        },
      },
    });

    const growthRate =
      lastWeekAdmissions === 0
        ? 100
        : (((thisWeekAdmissions - lastWeekAdmissions) / lastWeekAdmissions) * 100).toFixed(2);

    res.json({
      thisWeekAdmissions,
      lastWeekAdmissions,
      growthRate: parseFloat(growthRate),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getDoctorUtilization = async (req, res) => {
  try {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6); // includes today and previous 6 days

    const totalDoctors = await Doctor.count();

    const totalAppointments = await Appointment.count({
      where: {
        appointmentDate: {
          [Op.between]: [sevenDaysAgo, today],
        },
      },
    });

    const avgAppointmentsPerDoctor =
      totalDoctors > 0 ? (totalAppointments / totalDoctors).toFixed(2) : "0.00";

    res.json({
      totalDoctors,
      totalAppointments,
      avgAppointmentsPerDoctor: parseFloat(avgAppointmentsPerDoctor),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAverageLengthOfStay = async (req, res) => {
  try {
    const discharges = await Patient.findAll({
      where: {
        dischargeDate: {
          [Op.not]: null,
        },
      },
      attributes: ["admissionDate", "dischargeDate"],
      raw: true,
    });

    const totalDays = discharges.reduce((sum, patient) => {
      const admitted = new Date(patient.admissionDate);
      const discharged = new Date(patient.dischargeDate);
      const stayDuration = Math.ceil((discharged - admitted) / (1000 * 60 * 60 * 24));
      return sum + (stayDuration > 0 ? stayDuration : 0);
    }, 0);

    const avgLengthOfStay = discharges.length > 0 ? (totalDays / discharges.length).toFixed(2) : 0;

    res.json({ averageLengthOfStay: avgLengthOfStay });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getBedOccupancyTrend = async (req, res) => {
  try {
    const trends = [];

    const totalBeds = await Bed.count(); // get once outside the loop

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const isoDate = date.toISOString().split("T")[0];

      const startOfDay = new Date(`${isoDate}T00:00:00`);
      const endOfDay = new Date(`${isoDate}T23:59:59`);

      // Assuming the Patient model has admissionDate and is linked to beds
      const occupiedBeds = await Patient.count({
        where: {
          admissionDate: {
            [Op.between]: [startOfDay, endOfDay],
          },
        },
      });

      const occupancyRate = totalBeds > 0 ? (occupiedBeds / totalBeds) * 100 : 0;

      trends.push({
        date: isoDate,
        occupancyRate: occupancyRate.toFixed(2),
      });
    }

    res.json(trends);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const getNoShowRate = async (req, res) => {
  try {
    const totalAppointments = await Appointment.count({
      where: {
        appointmentDate: {
          [Op.lte]: new Date(), // Past appointments
        },
      },
    });

    const missedAppointments = await Appointment.count({
      where: {
        status: "Missed",
        appointmentDate: {
          [Op.lte]: new Date(),
        },
      },
    });

    const noShowRate = totalAppointments > 0
      ? ((missedAppointments / totalAppointments) * 100).toFixed(2)
      : 0;

    res.json({
      totalAppointments,
      missedAppointments,
      noShowRate,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



module.exports = {getAdmissionsDischarges,
getRoomOccupancy,
getAppointmentsBreakdown,
getDoctorLoad,
getBedTurnoverRate,
getAdmissionGrowthRate,
getDoctorUtilization,
getAverageLengthOfStay,
getBedOccupancyTrend,
getNoShowRate,
}
