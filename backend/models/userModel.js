const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // Adjust path to your DB config

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: {
          args: [/^\d{10}$/],
          msg: 'Phone number must be exactly 10 digits.',
        },
      },
    },

    gender: {
      type: DataTypes.ENUM('Male', 'Female', 'Other'),
      allowNull: true,
    },

    dob: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    bloodGroup: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    role: {
      type: DataTypes.ENUM(
        'admin',
        'doctor',
        'nurse',
        'lab',
        'receptionist',
        'patient'
      ),
      allowNull: false,
    },

    specialization: {
      type: DataTypes.STRING, // for doctors
      allowNull: true,
    },

    profileImage: {
      type: DataTypes.STRING, // URL or path
      allowNull: true,
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
    tableName: 'users',
  }
);

module.exports = User;
