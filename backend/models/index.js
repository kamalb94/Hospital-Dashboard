const Sequelize = require('sequelize');
const sequelize = require('../db');

const User = require('./userModel');
const Patient = require('./patientModel');
const Doctor = require('./doctorModel');
const Appointment = require('./appointmentModel');
const Room = require('./roomModel');
const Bed = require('./bedModel');

const associateModels = () => {
  // User -> Patient (1:1)
  User.hasOne(Patient, { foreignKey: 'userId', as: 'patient' });
  Patient.belongsTo(User, { foreignKey: 'userId', as: 'user' });

  // User -> Doctor (1:1)
  User.hasOne(Doctor, { foreignKey: 'userId', as: 'doctor' });
  Doctor.belongsTo(User, { foreignKey: 'userId', as: 'user' });

  // Appointment -> Patient (Many appointments can belong to a single patient)
  Appointment.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient' });
  Patient.hasMany(Appointment, { foreignKey: 'patientId', as: 'appointments' });

  // Appointment -> Doctor (Many appointments can belong to a single doctor)
  Appointment.belongsTo(Doctor, { foreignKey: 'doctorId', as: 'doctor' });
  Doctor.hasMany(Appointment, { foreignKey: 'doctorId', as: 'appointments' });

  // Room -> Bed (1:M)
  Room.hasMany(Bed, { foreignKey: 'roomId', as: 'beds' });
  Bed.belongsTo(Room, { foreignKey: 'roomId', as: 'room' });

  // Room & Bed assigned to Patient (optional depending on admission status)
  Room.hasMany(Patient, { foreignKey: 'roomId', as: 'patients' });
  Patient.belongsTo(Room, { foreignKey: 'roomId', as: 'room' });

  Bed.hasOne(Patient, { foreignKey: 'bedId', as: 'occupiedBy' });
  Patient.belongsTo(Bed, { foreignKey: 'bedId', as: 'bed' });
};

associateModels();

module.exports = {
  sequelize,
  Sequelize,
  User,
  Patient,
  Doctor,
  Appointment,
  Room,
  Bed,
};
