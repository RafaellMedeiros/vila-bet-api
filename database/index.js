const Sequelize = require('sequelize');

const connection = new Sequelize(process.env.DATA_BASE_SCHEMA,
    process.env.DATA_BASE_USER,
    process.env.DATA_BASE_PASS, 
    {
        host: process.env.DATA_BASE_HOST,
        dialect: "mysql"
    }
);

module.exports = connection;