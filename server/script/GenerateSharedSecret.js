//const QRCode = require('qrcode');
// const crypto = require('crypto');
require('dotenv').config();

function GenerateSharedKey(useremail) {
    const appsecret = process.env.SHARED_KEY + useremail;
    // const prime_length = 512;
    // const diffHell = crypto.createDiffieHellman(prime_length);

    // diffHell.generateKeys('base64');
    // console.log("Public Key : " ,diffHell.getPublicKey('base64'));
    // console.log("Private Key : " ,diffHell.getPrivateKey('base64'));

    // console.log("Public Key : " ,diffHell.getPublicKey('hex'));
    // console.log("Private Key : " ,diffHell.getPrivateKey('hex'));
    // let qrcode= '';
    // QRCode.toString(appsecret, (err, url) => {
    //     qrcode = url;
    // });
    return appsecret ;
}

module.exports = GenerateSharedKey;