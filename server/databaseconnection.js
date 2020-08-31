const Sequelize = require('sequelize');
require('dotenv').config();

const Op = Sequelize.Op
//Connection setup <name of database>, <username>, <password> ,
// { host: 'localhost', dialect: 'postgres'}
const database =new Sequelize(process.env.POSTGRES_DATABASENAME,
  process.env.POSTGRES_USERNAME, process.env.POSTGRES_PASSWORD, {
    host: process.env.POSTGRES_HOST,
    dialect: 'postgres',
    operatorsAliases: {
        $and: Op.and,
        $or: Op.or,
        $eq: Op.eq,
        $gt: Op.gt,
        $lt: Op.lt,
        $lte: Op.lte,
        $like: Op.like
      }
});
//default port is 8000
module.exports = database;