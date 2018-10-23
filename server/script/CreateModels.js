const database = require('../databaseconnection');

//create models
require('../user/user.model');

//sync models
database.sync({force: true}).then(() => database.close());

