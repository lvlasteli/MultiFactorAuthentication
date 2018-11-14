var notp = require('./TOTP');

function TwoFactorAuthentication(key, token) {
    const checkCode = notp.totp.verify(token, key);
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
