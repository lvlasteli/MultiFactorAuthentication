const express = require('express');
const router =  express.Router();
const Sequelize = require('sequelize');
//const database = require('../databaseconnection');
const User = require('./user.model');
const bcrypt = require('bcrypt');

router.post('/signup', (req, res) => {
    //check if we already have that user
    User.findOne({
        where: {username: req.body.username}
        }).then((user) => {
        // check if user exists in database
        if(user!== null) {
            return res.status(409).json({message: 'User already exists'})
        }
        else {
             //hasing password with 10 randoms string
             bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err) {
                    return res.status(500).json({ error: err});
                } else {
                    User.create({
                        id: Sequelize.fn( 'RANDOM' ),
                        username: req.body.username,
                        email: req.body.email,
                        password: hash,
                        twofactorauth: false
                    }).then((result)=> {
                        console.log(result);
                        res.status(201).json({
                            message: 'User Created'
                        });
                    }).catch(err => {
                        console.log(err);
                        res.status(500).json({error: err});
                    });
                }
            });
        }
    });
});

module.exports = router;
