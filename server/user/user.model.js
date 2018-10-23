const Sequelize = require('sequelize');
const database = require('../databaseconnection');

const User = database.define('user', {
    id: {
        type: Sequelize.STRING,
        primaryKey: true,
    },
    username: {
        type: Sequelize.STRING,
        required: true
    },
    password: {
        type: Sequelize.STRING,
        required: true
    },
    twofactorauth: Sequelize.BOOLEAN
    
});

module.exports = User;