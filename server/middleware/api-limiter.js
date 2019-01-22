const { RateLimiterMemory } = require('rate-limiter-flexible');

const options = {
    points: 5, //5 points
    duration: 1*60, //per second
    blockDuration: 1*60 //block for 1 minute
};
const apiLimiter = new RateLimiterMemory(options);
module.exports = (req, res, next) => {
    apiLimiter.consume(req.connection.remoteAddress, 1) //consumed 1 point
    .then(() => {
        next();
    })
    .catch(() => {
        res.status(200).send({message: 'Failed too many times, wait 1 minute'});
    });
}