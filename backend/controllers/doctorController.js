const { Doctor, User } = require("../models");

const getAllDoctors = async(req,res) => {
    try{
        const doctors = await Doctor.findAll({
            include: {
                model: User,
                as: 'user',
                attributes: ['id', 'fullName', 'email', 'role']
            }
        });

        return res.status(200).json(doctors);
    }catch(err){
        console.log(err);
    }
}

const getDoctorById = async(req, res) => {
    try{
        const {id} = req.params;
        if(!id){
            return res.status(400).json({message: 'id is not provided'});
        }
        const doctor = await Doctor.findOne({
            where: {id},
            include: {
                model: User,
                as: 'user',
                attributes: ['id', 'fullName', 'email', 'role']
            }
        })
        console.log(doctor);

        if(!doctor){
            return res.status(400).json({message: 'doctor not found'});
        }

        return res.status(200).json(doctor);
    }catch(err){
        console.log(err);
    }
}

const wipeDoctorsData = async (req, res) => {
  try {
    // Delete all rows from the 'doctors' table
    const deletedCount = await Doctor.destroy({
      where: {},  // Empty condition deletes all rows
    });

    // Check if rows were deleted
    if (deletedCount === 0) {
      return res.status(404).json({ message: 'No doctors found to delete' });
    }

    return res.status(200).json({ message: `✅ Successfully deleted ${deletedCount} doctors from the database` });
  } catch (error) {
    console.error('❌ Error deleting doctors:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {getAllDoctors, getDoctorById, wipeDoctorsData};