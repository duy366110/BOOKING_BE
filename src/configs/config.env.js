"use strict"
require('dotenv').config();

const Config = {
    DEV: {
        DB_URL: process.env.MONGODB_DEV_URL,
        CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
        CLOUDINARY_KEY: process.env.CLOUDINARY_KEY,
        CLOUDINARY_SECRET: process.env.CLOUDINARY_SECRET,
        CLOUDINARY_DIRECTORY: process.env.DIRECTORY_DEV || 'test'
    },
    PRO: {
        DB_URL:process.env.MONGODB_PRO_URL,
        CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
        CLOUDINARY_KEY: process.env.CLOUDINARY_KEY,
        CLOUDINARY_SECRET: process.env.CLOUDINARY_SECRET,
        CLOUDINARY_DIRECTORY: process.env.DIRECTORY_PRO || 'booking'
    }
}

const configInstance = Config[process.env.MODEL];

module.exports = configInstance;