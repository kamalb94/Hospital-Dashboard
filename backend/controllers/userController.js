const { User } = require("../models");


// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to get users' });
  }
};

// Get all users by role (generalized function)
const getUsersByRole = (role) => async (req, res) => {
  try {
    const users = await User.findAll({ where: { role } });
    res.status(200).json(users);
  } catch (error) {
    console.error(`Error fetching ${role}s:`, error);
    res.status(500).json({ message: `Failed to get ${role}s` });
  }
};

// Export role-specific handlers
const getAllDoctors = getUsersByRole('doctor');
const getAllNurses = getUsersByRole('nurse');
const getAllReceptionists = getUsersByRole('receptionist');
const getAllLabs = getUsersByRole('lab');
const getAllAdmins = getUsersByRole('admin');
const getAllPatients = getUsersByRole('patient');

module.exports = {
  getAllUsers,
  getAllDoctors,
  getAllNurses,
  getAllReceptionists,
  getAllLabs,
  getAllAdmins,
  getAllPatients,
};