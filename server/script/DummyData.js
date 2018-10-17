const User = require('../user/user.model');
const database = require('../databaseconnection');

//dummy data
Promise.all([
    User.create({
        id: '1',
        userName: 'lvlasteli',
        password: 'sifra1950',
        twoFactorAuth: 'true'
    }),
    User.create({
        id: '2',
        userName: 'mdgekic',
        password: 'sifra123',
        twoFactorAuth: 'false'
    })
])
.then(() => database.close());
