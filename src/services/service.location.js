"use strict"
const ModelLocation = require("../model/model-location");
const UtilCloudinary = require("../util/util.cloudinary");
const ConfigEnv = require("../configs/config.env");

class ServiceLocation {

    constructor() { }

    // LẤY DANH SÁCH LOCATION
    async getLimit(limit, start, cb) {
        try {
            let locations = await ModelLocation.find({}).limit(limit).skip(start).lean();
            cb({status: true, message: 'Get locations successfully', locations});

        } catch (error) {
            // THỰC HIỆN PHƯƠNG THỨC LỖI
            cb({status: false, message: 'Method failed', error});
        }
    }

    // LẤY DANH SÁCH LOCATION
    async getAll(cb) {
        try {
            let locations = await ModelLocation.find({}).lean();
            cb({status: true, message: 'Get locations successfully', locations});

        } catch (error) {
            // THỰC HIỆN PHƯƠNG THỨC LỖI
            cb({status: false, message: 'Method failed', error});
        }
    }

    // LẤY DANH PHẦN TỬ THEO ID
    async getById(id, cb) {
        try {
            let location = await ModelLocation.findById(id).lean();
            cb({status: true, message: 'Get location location successfully', location});

        } catch (error) {
            // THỰC HIỆN PHƯƠNG THỨC LỖI
            cb({status: false, message: 'Method failed', error});
        }
    }

    // LẤY SỐ LƯỢNG LOCATION
    async getAmount(cb) {
        try {
            let amount = await ModelLocation.find({}).count().lean();
            cb({status: true, message: 'Get amount location successfully', amount});

        } catch (error) {
            // THỰC HIỆN PHƯƠNG THỨC LỖI
            cb({status: false, message: 'Method failed', error});
        }
    }

    // TẠO MỚI LOCATION
    async create(location, images, cb) {
        try {
            await ModelLocation.create({title: location.title, images});
            cb({status: true, message: 'Create location successfully'});

        } catch (error) {
            // THỰC HIỆN PHƯƠNG THỨC LỖI
            cb({status: false, message: 'Method failed', error});
        }
    }

    // CẬP NHẬT LOCATION
    async update(location = {}, images = [], cb) {
        try {
            if(images.length) {
                for(let image of images) {
                    location.model.images.push(image);
                }
            }

            location.model.title = location.title;
            location.model.updateDate = new Date();
            await location.model.save();

            cb({status: true, message: 'Update location successfully'});

        } catch (error) {
            // THỰC HIỆN PHƯƠNG THỨC LỖI
            cb({status: false, message: 'Method failed', error});
        }
    }

    // XOÁ LOCATION
    async delete(location = {}, cb) {
        try {

            if(location.model.images.length) {
                let images = [];
                for(let image of location.model.images) {
                    let imageName = image.split('/').splice(-1).join('').split(".")[0];

                    // THUC HIEN KIEM TRA XEM FILE CO TON TAI TREN CLOUD
                    let {status, result } = await UtilCloudinary.exists(`${ConfigEnv.CLOUDINARY_DIRECTORY}/${imageName}`);
                    if(status) {
                        images.push(`${ConfigEnv.CLOUDINARY_DIRECTORY}/${imageName}`);
                    }
                }
                
                if(images.length) {
                    await UtilCloudinary.destroyMany(images);
                }
            }

            await location.model.deleteOne();
            cb({status: true, message: 'Update location successfully'});

        } catch (error) {
            // THỰC HIỆN PHƯƠNG THỨC LỖI
            cb({status: false, message: 'Method failed', error});
        }
    }


    // XOÁ ẢNH LOCATION
    async deleteImage(location = {}, photo = '', cb) {
        try {

            // KIỂM TRA ẢNH CÓ TỒN TẠI THỰC HIỆN XOÁ
            if(location.model.images.length) {

                for(let image of location.model.images) {
                    if(image === photo) {
                        let imageName = image.split('/').splice(-1).join('').split(".")[0];

                        // THỰC HIỆN KIỂM TRA XEM FILE TỒN TẠI VÀ XOÁ FILE CLOUD
                        let {status, result } = await UtilCloudinary.exists(`${ConfigEnv.CLOUDINARY_DIRECTORY}/${imageName}`);
                        if(status) {
                            await UtilCloudinary.destroy(`${ConfigEnv.CLOUDINARY_DIRECTORY}/${imageName}`);
                            break;
                        }
                    }
                }
            }

            // THỰC HIỆN XOÁ FILE TRONG DB
             location.model.images =  location.model.images.filter((image) => image !== photo);
            await  location.model.save();

            cb({status: true, message: 'Delete photo image successfully'});

        } catch (error) {
            // THỰC HIỆN PHƯƠNG THỨC LỖI
            cb({status: false, message: 'Method failed', error});
        }
    }
}

module.exports = new ServiceLocation();


  