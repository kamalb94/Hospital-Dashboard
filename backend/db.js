const {Sequelize} = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    server: process.env.HOST,
    dialect: 'mssql',
    port: parseInt(process.env.DB_PORT),
    dialectOptions: {
        options: {
            encrypt: false,
            trustServverCertificate: true
        }
    },
    logging: false,
})

module.exports = sequelize;