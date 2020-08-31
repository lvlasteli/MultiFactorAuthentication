let crypto = require('crypto');
const User = require('../user/user.model');
const aes256 = require('aes256');
require('dotenv').config();

function GetUserID(userEmail)
{
    return User.findOne({where: { email: userEmail }})
    .then((result) => {
        return result.id;
    })
    .catch((err) => {
        return err;
    });
}


async function GenerateSharedKey(userEmail) {
    //Is unsafe to store it in enviroment variable
    const key = process.env.MASTER_KEY;
    const algorithm = 'sha512';
    let text = await GetUserID(userEmail);
    text = text + Date.now();
    const sharedSecret = crypto.createHmac(algorithm, key).update(text).digest('hex');
    const encryptedSharedSecret = aes256.encrypt(key, sharedSecret);
    User.update({ shared_key: encryptedSharedSecret }, { where: { email: userEmail } });
    return sharedSecret;
}

module.exports = GenerateSharedKey;

