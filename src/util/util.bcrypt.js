const bcrypt = require("bcryptjs");

class Bcrypt  {

    salt = 12;

    constructor() {}


    has = (password) => {
        return bcrypt.hashSync(password, this.salt);
    }

    compare = (password, hash, callback) => {
        bcrypt.compare(password, hash, (error, data) => {
            if(data) {
                callback({status: true, hash: data});

            } else {
                callback({status: false, hash: null});
                
            }
        })
    }
}

module.exports = new Bcrypt();