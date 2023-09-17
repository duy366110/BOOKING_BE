const jwt = require('jsonwebtoken');

class JWT {

    serect = 'booking_application_website_366110';

    constructor() { }

    sign = function (infor = {}, cb) {
        jwt.sign(infor, this.serect, { expiresIn: 60 * 60 * 24}, (err, token) => {
            if(err) cb({status: false, message: 'Sign token faile', token: ''});
            cb({status: true, message: 'Sign token successfully', token});
        });
    }

    verify = function (token = '', cb) {
        jwt.verify(token, this.serect, (err, infor) => {
            if(err) cb({status: false, message: err});
            cb({status: true, message: 'verify successfully', infor});
        })
    }
}

module.exports = new JWT();