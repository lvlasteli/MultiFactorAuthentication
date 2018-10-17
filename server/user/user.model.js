const Sequelize = require('sequelize');
const database = require('../databaseconnection');

const User = database.define('user', {
    id: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    userName: Sequelize.STRING,
    password: Sequelize.STRING,
    twoFactorAuth: Sequelize.BOOLEAN
    
});

module.exports = User;