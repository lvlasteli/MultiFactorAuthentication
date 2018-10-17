const Sequelize = require('sequelize');

//Connection setup <name of database>, <username>, <password> , { host: 'localhost', dialect: 'postgres'}
const database =new Sequelize('2FactorAuth', 'postgres', 'axeq627a', {
    host: 'localhost',
    dialect: 'postgres' 
});

module.exports = database;