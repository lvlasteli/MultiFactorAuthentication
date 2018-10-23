const express = require('express');
const router =  express.Router();
const Sequelize = require('sequelize');
//const database = require('../databaseconnection');
const User = require('./user.model');
const bcrypt = require('bcrypt');

router.post('/signup', (req, res) => {
        //hasing password with 10 randoms string
        bcrypt.hash(req.body.password, 10, (err, hash) => {
            if(err) {
                return res.status(500).json({
                    error: err
                });
            } else {
                User.create({
                    id: Sequelize.fn( 'RANDOM' ),
                    username: req.body.username,
                    password: hash,
                    twofactorauth: false
                }).then((result)=> {
                    console.log(result);
                    res.status(201).json({
                        message: 'User Created'
                    });
                }).catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                })
            }
        })
    });

module.exports = router;