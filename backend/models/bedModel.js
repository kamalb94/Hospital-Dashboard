const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Bed = sequelize.define('Bed', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  bedNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },


  roomId: {
  type: DataTypes.UUID,
  allowNull: true,
},

  status: {
    type: DataTypes.ENUM('Available', 'Occupied', 'Maintenance'),
    defaultValue: 'Available',
  },

  isICU: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  pricePerDay: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },

}, {
  timestamps: true,
  tableName: 'beds',
});

module.exports = Bed;
