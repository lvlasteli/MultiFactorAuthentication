const Sequelize = require('sequelize');
const database = require('../databaseconnection');

const User = database.define('user', {
    id: {
        type: Sequelize.STRING,
        primaryKey: true,
    },
    email: {
        type: Sequelize.STRING,
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    username: {
        type: Sequelize.STRING,
        required: true
    },
    password: {
        type: Sequelize.STRING,
        required: true
    },
    twofactorauth: {
        type: Sequelize.BOOLEAN,
        defaultValue:false

    },
    shared_key: {
        type: Sequelize.STRING,
        allowNull:true,
    }

    
});

module.exports = User;