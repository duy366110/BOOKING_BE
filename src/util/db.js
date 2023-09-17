const mongoose = require("mongoose");

class mongodb {

    constructor() { }

    connect = (callback) => {
        mongoose.connect('mongodb://127.0.0.1:27017/ass_02')
        .then(() => {
            callback();
        })
        .catch((error) => {
            throw error;

        })
    }
}

module.exports = new mongodb();