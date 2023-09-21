"use strict"
const ServiceUser = require("../services/service.user");

class MiddlewareAuthorization {

    constructor() { }

    // THỰC HIỆN VERIFY TOKEN
    async verifyToken(req, res, next) {
        try {
            let authorization = req.get("authorization");
            authorization = authorization.replace('Bearer ', '');
            ServiceUser.verifyAuthorization(authorization, (information) => {
                let {status, message, user} = information;

                if(status) {
                    req.user = user;
                    next();

                } else {
                    res.status(406).json({status: false, message});
                }

            })

        } catch (error) {
            // PHƯƠNG THỨC LỖI
            res.status(500).json({status: false, message: 'Internal server failed'});
        }
    }

}

module.exports = new MiddlewareAuthorization();