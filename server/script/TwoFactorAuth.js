const notp = require('./TOTP');
const aes256 = require('aes256');
require('dotenv').config();

function TwoFactorAuthentication(encryptedSharedKey, token) {
    const key = process.env.MASTER_KEY;
    const decryptedSharedKey = aes256.decrypt(key, encryptedSharedKey);
    const checkCode = notp.totp.verify(token, decryptedSharedKey);
    if (!checkCode) {
        console.log('Token invalid!');
    }
    else {
        console.log('Token valid!');
    }
    //if token is valid return 1 (true), else 0 (false)
    return (checkCode ? 1 : 0);
}

module.exports = TwoFactorAuthentication;
