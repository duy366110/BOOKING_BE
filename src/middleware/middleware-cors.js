const Environment = require("../environment");

class MiddlewareCors  {

    constructor() { }

    cors = (req, res, next) => {
        let origin = req.get('origin');

        if(Environment.cors.origins.some((host) => host === origin)) {
            res.setHeader('Access-Control-Allow-Origin', origin);
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            next();

        } else {
            res.status(400).json({status: false, message: 'Corss origin resuce sharing policy from server'});

        }
        
    }

}

module.exports = new MiddlewareCors();