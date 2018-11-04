const User = require('../user/user.model');
const database = require('../databaseconnection');
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

let pass1="";
let pass2 ="";

Promise.all([
    bcrypt.hash('sifra1950',10).then((hash => {
        pass1 = hash;
    })),
    bcrypt.hash('sifra1234',10).then((hash => {
        pass2 = hash;
    }))
]).then(()=> {
    //dummy data
    Promise.all([
        User.create({
            id: Sequelize.fn( 'RANDOM' ),
            username: 'lvlasteli',
            email: 'lvlast00@fesb.hr',
            password: pass1  ,
            twofactorauth: 'true'
        }),
        User.create({
            id: Sequelize.fn( 'RANDOM' ),
            username: 'mgekic',
            email: 'mgekic00@fesb.hr',
            password: pass2,
        })
    ])
    .then(() => database.close())
})




