const crypto = require('crypto');
const User = require('../user/user.model');
require('dotenv').config();

function GetUserID(useremail)
{
    return User.findOne( {where: { email: useremail } })
    .then((result) => {
        return result.id;
    })
    .catch((err) => {
        return err;
    });
}


async function GenerateSharedKey(useremail) {
    //Is unsafe to store it in enviroment variable
    const key = process.env.MASTER_KEY;
    const algorithm = 'sha512';
    const text =await GetUserID(useremail);
    const hmac = crypto.createHmac(algorithm, key).update(text).digest('hex');
    User.update( { shared_key: hmac },
        { where: { email: useremail } });
    return hmac;
}

module.exports = GenerateSharedKey;

