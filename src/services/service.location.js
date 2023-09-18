"use strict"
const ModelLocation = require("../model/model-location");

class ServiceLocation {

    constructor() { }

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
    async update(location, images, cb) {
        try {
            if(images.length) {
                for(let image of images) {
                    location.model.images.push(image);
                }
            }

            location.model.title = location.title;
            await location.model.save();

            cb({status: true, message: 'Update location successfully'});

        } catch (error) {
            // THỰC HIỆN PHƯƠNG THỨC LỖI
            cb({status: false, message: 'Method failed', error});
        }
    }
}

module.exports = new ServiceLocation();

