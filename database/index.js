const Sequelize = require('sequelize');

// const connection = new Sequelize('vilabe06_vila-bet',
//     'vilabe06_root',
//     'Antipam#1', 
//     {
//         host: 'ns1016.hostgator.com.br',
//         dialect: "mysql"
//     }
// );

const connection = new Sequelize('perguntas',
    'root',
    '663034', 
    {
        host: 'localhost',
        dialect: "mysql"
    }
);

module.exports = connection;