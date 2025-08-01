const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Patient = sequelize.define('Patient', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },

  medicalHistory: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  diseases: {
  type: DataTypes.STRING, // ✅ Use a comma-separated string instead
  allowNull: true,
  comment: 'Chronic or current illnesses like diabetes, hypertension, etc.',
},

  emergencyContact: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      is: {
        args: /^\d{10}$/,
        msg: 'Emergency contact must be exactly 10 digits.',
      },
    },
  },

  guardianName: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  guardianRelation: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  roomId: {
  type: DataTypes.UUID,
  allowNull: true,
  references: {
    model: 'rooms', 
    key: 'id',
  },
},

bedId: {
  type: DataTypes.UUID,
  allowNull: true,
  references: {
    model: 'beds', 
    key: 'id',
  },
},


  admissionDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },

  dischargeDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },

  currentStatus: {
    type: DataTypes.ENUM('admitted', 'discharged', 'under observation', 'outpatient'),
    defaultValue: 'outpatient',
  },

  assignedDoctorId: {
    type: DataTypes.UUID,
    allowNull: true,
  },

}, {
  timestamps: true,
  tableName: 'patients',
});

module.exports = Patient;
