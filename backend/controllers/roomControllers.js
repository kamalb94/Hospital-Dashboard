const { Room } = require("../models");

const getAllRooms = async(req, res)=> {
    try{
    const rooms = await Room.findAll();

    if(!rooms){
        return res.status(400).json({message: 'No rooms found'});
    }

    return res.status(200).json(rooms);

    }catch(err){
        console.log(err);
    }
}

const deleteAllRooms = async (req, res) => {
  try {
    await Room.destroy({
      where: {},       // Deletes all records
      cascade: true,   // Only effective if ON DELETE CASCADE is set on foreign keys
      // truncate: true  <-- REMOVE THIS
    });

    console.log('All rooms deleted');
    return res.status(200).json({ message: 'All rooms deleted successfully' });
  } catch (err) {
    console.error('Error deleting rooms:', err);
    return res.status(500).json({ error: 'Failed to delete rooms' });
  }
};


module.exports = {getAllRooms, deleteAllRooms};
