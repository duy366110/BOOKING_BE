"use strict"
require('dotenv').config();

const Config = {
    DEV: {
        DB_URL: process.env.MONGODB_DEV_URL
    },
    PRO: {
        DB_URL:process.env.MONGODB_PRO_URL
    }
}

const configInstance = Config[process.env.MODEL];

module.exports = configInstance;