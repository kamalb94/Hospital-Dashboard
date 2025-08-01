const { Patient, User } = require("../models");

const getAllPatients = async (req, res) => {
  try {
    console.log("Fetching all patients...");

    const raw = await Patient.findAll({ raw: true });
    console.log("Raw result:", raw);

    res.status(200).json(raw);
  } catch (error) {
    console.error("Error in getAllPatients:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


const getPatientById = async(req, res)=> {
    try{
        const {id} = req.params;
        const patient = await Patient.findOne({
            where: {id},
            include: {
                model: User,
                as: 'user',
                attributes: ['id', 'fullName', 'email', 'role']
            }
        });
        console.log('patient', patient);

        if(!patient){
            return res.status(400).json({message: 'Patient not found!'});
        }

        return res.status(200).json(patient);
    }catch(error){
        console.log(error);
    }
}

function getRandomPastDate(maxDaysAgo = 60) {
  const daysAgo = Math.floor(Math.random() * maxDaysAgo) + 1;
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date;
}

function getRandomFutureDate(minDaysAhead = 1, maxDaysAhead = 30) {
  const daysAhead = Math.floor(Math.random() * (maxDaysAhead - minDaysAhead + 1)) + minDaysAhead;
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date;
}

const updatePatientStatuses = async (req, res) => {
  try {
    const patients = await Patient.findAll();

    await Promise.all(
      patients.map(async (patient) => {
        if (!patient.roomId && !patient.bedId) {
          // Not assigned to any room or bed → discharged with past admission/discharge dates
          const admissionDate = getRandomPastDate(60);
          const dischargeDate = new Date(admissionDate);
          dischargeDate.setDate(admissionDate.getDate() + Math.floor(Math.random() * 10) + 1);

          return patient.update({
            currentStatus: 'discharged',
            admissionDate,
            dischargeDate,
          });
        } else {
          // Assigned → admitted or under observation with future discharge
          const admissionDate = getRandomPastDate(30);
          const dischargeDate = getRandomFutureDate(1, 30);
          const status = Math.random() < 0.5 ? 'admitted' : 'under observation';

          return patient.update({
            currentStatus: status,
            admissionDate,
            dischargeDate,
          });
        }
      })
    );

    return res.status(200).json({ message: 'Patient statuses updated successfully' });
  } catch (err) {
    console.error('Error updating patient statuses:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const wipePatientsData = async (req, res) => {
  try {
    // Delete all rows from the 'doctors' table
    const deletedCount = await Patient.destroy({
      where: {},  // Empty condition deletes all rows
    });

    // Check if rows were deleted
    if (deletedCount === 0) {
      return res.status(404).json({ message: 'No doctors found to delete' });
    }

    return res.status(200).json({ message: `✅ Successfully deleted ${deletedCount} patients from the database` });
  } catch (error) {
    console.error('❌ Error deleting patients:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};



module.exports = {getAllPatients, getPatientById, updatePatientStatuses, wipePatientsData};