const { Bed } = require("../models");

const getAllBeds = async(req, res)=> {
    try{
        const beds = await Bed.findAll();

        res.status(200).json(beds);
    }catch(err){
        console.log(err);
    }
}

const wipeBeds = async (req, res) => {
  try {
    await Bed.destroy({
      where: {},     // Delete all records
      force: true,   // Ensure hard delete (not just soft delete if paranoid mode is used)
    });

    console.log("All beds deleted successfully.");
    return res.status(200).json({message: 'Deleted successfully'})
  } catch (error) {
    console.error("Error while deleting beds:", error.message);
  }
};

module.exports = {getAllBeds, wipeBeds};