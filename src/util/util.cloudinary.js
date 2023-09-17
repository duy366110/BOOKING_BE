require('dotenv').config();
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
// const CONFIG_CLOUDINARY = require("../configs/config.cloudinary");
const ConfigEnv = require("../configs/config.env");


class CLOUDINARY {

    constructor() {
        cloudinary.config({
            cloud_name: ConfigEnv.CLOUDINARY_NAME,
            api_key: ConfigEnv.CLOUDINARY_KEY,
            api_secret: ConfigEnv.CLOUDINARY_SECRET,
        })
    }

    // UPLOAD FILE LÊN CLOUD
    storage = new CloudinaryStorage({
        cloudinary,
        allowedFormats: ['jpeg', 'jpg', 'png'],
        filename: function (req, file, cb) {
            cb(null, file.originalname); 
        },
        params: {
            folder: 'booking',
        }
    })

    // KIEN TRA FILE TON TAI TREN CLOUD
    exists = async (public_id) => {
        try {
            let result = await cloudinary.api.resource(public_id);
            return {status: true, result};


        } catch (err) {
            return {status: false, result: null};
        }
    }



    // XOÁ FILE TRÊN CLOUD
    destroy = async (path) => {
        try {
            let status = await cloudinary.api.delete_resources_by_prefix(path);
            return {status: true, message: 'Delete image successfully'};


        } catch (err) {
            return {status: false, message: 'Delete image failed'};
        }
    }
}

module.exports = new CLOUDINARY();