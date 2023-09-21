"use strict"
const ServiceUser = require("../services/service.user");

class MiddlewareAuthorization {

    constructor() { }

    // THỰC HIỆN VERIFY TOKEN
    async verifyToken(req, res, next) {
        try {
            let authorization = req.get("authorization");
            authorization = authorization.replace('Bearer ', '');

            if(authorization && authorization.length > 10) {
                ServiceUser.verifyAuthorization(authorization, (information) => {
                    let {status, message, user} = information;
    
                    if(status) {
                        req.user = user;
                        return next();
    
                    } else {
                        return res.status(406).json({status: false, message});
                    }
                })

            } else {
                return res.status(406).json({status: false, message: 'Token invalid'});
            }

        } catch (error) {
            // PHƯƠNG THỨC LỖI
            return res.status(500).json({status: false, message: 'Internal server failed'});
        }
    }

}

module.exports = new MiddlewareAuthorization();