const mongoose = require("mongoose");
const ConfigEnv = require("../configs/config.env");

class Mongodb {

    constructor() {
        this.connect();
    }

    connect() {
        mongoose.connect(ConfigEnv.DB_URL)
        .then(() => {
            console.log("Connect database sucessully");
        })
        .catch((error) => {
            throw error;

        })
    }

    static getInstance() {
        if(!Mongodb.instance) {
            Mongodb.instance = new Mongodb();
        }
        return Mongodb.instance;
    }
}

const Instance = Mongodb.getInstance();

module.exports = Instance;