const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Room = sequelize.define('Room', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  roomNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  type: {
    type: DataTypes.ENUM('General', 'Private', 'Semi-Private', 'ICU', 'Emergency'),
    allowNull: false,
  },

  totalBeds: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  floor: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

  notes: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: true,
  tableName: 'rooms',
});

module.exports = Room;