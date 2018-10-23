const Sequelize = require('sequelize');

//Connection setup <name of database>, <username>, <password> , { host: 'localhost', dialect: 'postgres'}
const database =new Sequelize('2FactorAuth', 'postgres', 'axeq627a', {
    host: 'localhost',
    dialect: 'postgres' 
});
//default port is 8000
module.exports = database;