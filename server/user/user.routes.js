require('dotenv').config()
const express = require('express');
const router =  express.Router();
const Sequelize = require('sequelize');
//const database = require('../databaseconnection');
const User = require('./user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');
const QRCode = require('../script/GenerateSharedSecret');

require('dotenv').config();

router.post('/signup', (req, res) => {
    //check if we already have that user
    User.findOne({
        where: {email: req.body.email}
        }).then((user) => {
        // check if user exists in database
        if(user!== null) {
            return res.status(409).json({message: 'User already exists'});
        }
        else {
             //hasing password with 10 random strings
             bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err) {
                    return res.status(500).json({ error: err});
                } else {
                    User.create({
                        id: Sequelize.fn( 'RANDOM' ),
                        username: req.body.username,
                        email: req.body.email,
                        password: hash,
                    }).then((result)=> {
                        console.log(result);
                        res.status(201).json({
                            message: 'User Created'
                        });
                    }).catch((err) => {
                        console.log(err);
                        res.status(500).json({message: 'User already exists'});
                    });
                }
            });
        }
    });
});
router.post('/login', (req, res) => {
    User.findOne({
        where: { email: req.body.email }
    })
    .then((user) => {
        if(user === null) {
            //bad for brute force attack to return message user doesnt exist
            return res.status(401).json({ message: 'Authorization failed'});
        }
        const username = user.username;
        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if(err) {
                return res.status(401).json({ message: 'Authorization failed'});
            }
            if (result) {
                //creation of token
                const token = jwt.sign({
                    email: user.email,
                    id: user.id
                }, process.env.JWT_KEY, 
                {
                    expiresIn: "1h"
                });
                return res.status(200).json({ 
                    message: 'Authorization successful',
                    token: token,
                    username: username
                });
            }
            return res.status(401).json({
                message: 'Authorization failed'});
        })
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({error: err});
    });
});
router.post('/qrcode', checkAuth, (req, res) => {
    const userEmail = req.headers.authorization.split(" ")[0];
    User.findOne({ where: { email: userEmail } })
    .then((result) => {
        const twofa = result.twofactorauth;
        if(twofa === true)
        {
            const qr = QRCode(userEmail);
            qr.then((result) => {
                return res.status(200).json({ message: "Token confirmed and your QrCode is" , enabled: twofa , qrcode: result });
            }).catch((err) => {
                console.log(err);
                res.status(500).json({error: err});
            });
        }
        else
        {
            return res.status(200).json({ message: "Token confirmed but 2FA is not required" , enabled: twofa });            
        }
    });
})

module.exports = router;