const Sequelize = require('sequelize');

const connection = new Sequelize('vilabe06_vila-bet',
    'vilabe06_root',
    'Antipam#1', 
    {
        host: 'ns1016.hostgator.com.br',
        dialect: "mysql"
    }
);

module.exports = connection;