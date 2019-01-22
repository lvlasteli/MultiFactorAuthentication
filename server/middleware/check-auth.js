const jwt =require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    //if we use jwt.decode we will just decode it but we wont know if its valid
    try {
        //we send him in a header with value Bearer xxxxxxxxxxxxx
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
        next();
    } catch {
        return res.status(200).json({
            message:'Authorization failed'
        });
    }
};