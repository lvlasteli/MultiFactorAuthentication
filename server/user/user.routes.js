require('dotenv').config()
const express = require('express');
const router =  express.Router();
const Sequelize = require('sequelize');
//const database = require('../databaseconnection');
const User = require('./user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');
const checkTries = require('../middleware/api-limiter');
const QRCode = require('../script/GenerateSharedSecret');
const TwoFactor=require('../script/TwoFactorAuth');

require('dotenv').config();

router.post('/signup', (req, res) => {
    //check if we already have that user
    User.findOne({where: {email: req.body.email}}).then((user) => {
        // check if user exists in database
        if(user !== null) {
            return res.status(409).json({message: 'User already exists'});
        } else {
             //hashing password with 10 random strings
             bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err) {
                    return res.status(500).json({ error: err});
                } else {
                    User.create({
                        id: Sequelize.fn( 'RANDOM' ),
                        username: req.body.username,
                        email: req.body.email,
                        password: hash,
                    }).then(()=> {
                        res.status(201).json({
                            message: 'User Created'
                        });
                    }).catch(err => {
                        console.log(err);
                        res.status(500).json({message: 'User already exists'});
                    });
                }
            });
        }
    });
});


router.post('/login', checkTries, (req, res) => {
    User.findOne({where: {email: req.body.email}}).then((user) => {
        if(user === null) {
            //bad for brute force attack to return message user doesn't exist
            return res.status(200).json({ message: 'Authorization failed'});
        }
        const username = user.username;
        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if(err)
                return res.status(200).json({ message: 'Authorization failed'});
            if (result) {
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
            return res.status(200).json({ message: 'Authorization failed'});
        })
    })
    .catch((err) => { res.status(500).json({error: err}); });
});

router.post('/qrcode', checkAuth, (req, res) => {
    const userEmail = req.userData.email;
    User.findOne({where: {email: userEmail}}).then(result => {
        const twoFA = result.twofactorauth;
        const userSuccess = result.successful_auth;
        if(twoFA) {
            if(result.shared_key === null) {
                const qr = QRCode(userEmail);
                qr.then(result => {
                    return res.status(200).json({ message: "Token confirmed and your QrCode is" , enabled: twoFA , qrcode: result });
                }).catch(err => {
                    res.status(500).json({error: err});
                });
            } else {
                if (userSuccess) {
                    return res.status(200).json({ message: "Token confirmed and your QrCode is" , enabled: twoFA , qrcode: null });
                } else {
                    return res.status(200).json({ message: "Token confirmed and your QrCode is" , enabled: twoFA , qrcode: result.shared_key });
                }
            }
        } else {
            return res.status(200).json({ message: "Token confirmed but 2FA is not required" , enabled: twoFA });            
        }
    });
});

//promini u get
router.post('/qrcode/validate', checkTries, checkAuth, (req, res) => {
    const userEmail = req.userData.email;
    return User.findOne({ where: { email: userEmail }}).then((user) => {
        const reply = TwoFactor(user.shared_key, req.body.code);
        if(reply) {
            return res.status(200).json({ message: "Code valid!", result: true });
        } else {
            return res.status(400).json({ message: "Code invalid!", result: false });
        }
    })
});

router.put('/success', checkAuth, (req) => {
    console.log("Success")
    const userEmail = req.userData.email;
    User.update({ successful_auth: req.body.bool }, { where: { email: userEmail }});
});


router.put('/qrcode/enabledisable', checkAuth, (req, res) => {
    const userEmail = req.userData.email;
    User.update({ twofactorauth : req.body.enabled }, { where: { email: userEmail }}).then(() => {
        if(req.body.enabled) {
            const qr = QRCode(userEmail);
            qr.then((result) => {
                return res.status(200).json({ message: "Token confirmed and your QrCode is" , enabled: req.body.enabled , qrcode: result });
            });
        } else {
            //code for disabling 2FA
            return res.status(200).json({ message: "2FA changed!" });
        }
    }).catch(() => {
        return res.status(400).json({ message: 'Authorization failed'});
    });
});

router.put('/qrcode/reset', checkTries ,checkAuth, (req, res) => {
    const userEmail = req.userData.email;
    if(userEmail === req.body.email) {
        User.findOne({ where: { email: req.body.email }}).then((user) => {
            if(user === null) {
                return res.status(400).json({ message: 'Denied', status: false});
            }
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if(err) {
                    return res.status(400).json({ message: 'Denied', status: false});
                }
                if(result) {
                    const qr = QRCode(userEmail);
                    qr.then(result => {
                        return User.update({shared_key: result, successful_auth: false}, 
                            {where: {email: req.body.email}}).then(() => {
                            return res.status(200).json({ message: 'Approved', status: true });
                        });
                    });
                } else {
                    return res.status(400).json({ message: 'Denied', status: false});
                }
            });
        });
    }
    else {
        return res.status(400).json({ message: 'Denied!', status: false});
    }
});



router.get('/testing/:code', (req, res) => {
    //const userEmail = req.headers.authorization.split(" ")[0];
    const shared_key = "64c4c61b7041505440bb424422348b89a59477cc3f57eda7c0f6b8170e1190e25885d3d1bfd14006343a35b73b25bf6259e8563dee91702eb2e41deb87b8a6fc";
    const reply = TwoFactor(shared_key, req.params.code);
    if(reply) {
        return res.status(200).json({ message: "Code valid!", result: true });
    } else {
        return res.status(400).json({ message: "Code invalid!", result: false });
    }
});

module.exports = router;