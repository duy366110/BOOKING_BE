const mongodb = require("mongodb");
const ModelLocation = require("../../model/model-location");
const { validationResult } = require("express-validator");
const path = require('path');
const fs = require('fs');
const UtilCloudinary = require("../../util/util.cloudinary");

class ControllerLocation {
    constructor() { }

    // LẤY DANH SÁCH LOCATION
    getLocation = async (req, res, next) => {
        try {
            let { limit, start} = req.params;
            let locationsInfor = await ModelLocation.find({}).limit(limit).skip(start).exec();
            res.status(200).json({status: true, message: 'Get location successfull', locations: locationsInfor});

        } catch (error) {
            res.status(500).json({status: false, message: 'Internal server failed'});
        }
    }

    // LÂY SỐ LƯỢNG LOCATION HIỆN CÓ
    getLocationAmount = async (req, res, next) => {
        try {
            let amountLocation = await ModelLocation.find({}).count().exec();
            res.status(200).json({
                status: true,
                message: 'Amount location successfully',
                amount: amountLocation
            });

        } catch (error) {
            res.status(500).json({status: false, message: 'Internal server failed'});
        }
    }

    // PHƯƠNG THỨC TÌM LOCATION THÔNG QUA ID
    findLocationById = async(req, res, next) => {
        try {
            let { location } = req.params;
            let locationInfor = await ModelLocation.findById(location);
            res.status(200).json({status: true, message: 'Find location successfully', location: locationInfor });

        } catch (error) {
            // PHƯƠNG THỨC LỖI
            res.status(500).json({status: false, message: 'Internal server failed'});;
        }
    }

    // PHƯƠNG THỨC LẤY DANH SÁCH LOCATION
    findLocation = async (req, res, next) => {
        try {
            let locationsInfor = await ModelLocation.find({});
            res.status(200).json({status: true, message: 'Find location successfully', locations: locationsInfor});

        } catch (error) {
            res.status(500).json({status: false, message: 'Internal server failed'});
        }
    }


    // ADMIN TẠO LOCATION
    createLocation = async (req, res, next) => {
        let { title } = req.body;
        let { files } =  req;
        let { errors } = validationResult(req);

        if(errors.length) {
            res.status(406).json({status: false, message: errors[0].msg});

        } else {
            try {

                // LẤY THÔNG TIN DANH SÁCH HÌNH ẢNH LOCATION.
                let paths = [];
                if(files.length) {
                    paths = files.map((image) => {
                        return image.path? image.path : '';
                    })
                }

                // TẠO MỚI THÔNG TIN LOCATION
                let status = await ModelLocation.create({title, images: paths});

                // GỬI STATUS VỀ ADMIN
                if(status) {
                    res.status(200).json({status: true, message: 'Create location successfully'});

                } else {
                    res.status(406).json({status: false, message: 'Create location failed'});
                }

            } catch (err) {
                // PHƯƠNG THỨC LỖI
                res.status(500).json({status: false, message: 'Internal server failed'});
            }
        }
    }

    // ADMIN TIẾN HÀNH CẬP NHẬT
    modifiLocation = async(req, res, next) => {
        let { errors } = validationResult(req);

        if(errors.length) {
            res.status(406).json({status: false, message: errors[0].msg});

        } else {
            try {
                let { location, title } = req.body;
                let { files } =  req;

                let locationInfor = await ModelLocation.findById(location);

                // LẤY THÔNG TIN DANH SÁCH HÌNH ẢNH LOCATION.
                let paths = [];
                if(files.length) {
                    paths = files.map((image) => {
                        return `images/${image.filename}`;
                    })

                    // THỰC HIỆN THÊM PHOTO VÀO LOCATION
                    for(let path of paths) {
                        locationInfor.images.push(path);
                    }
                }

                // THỰC HIỆN CẬP NHẬT THÔNG TIN VÀ GỬI TRẠNG THÁI VỀ ADMIN
                locationInfor.title = title;
                await locationInfor.save();
                res.status(200).json({status: true, message: "Update information location successfully"});


            } catch (error) {
                // PHƯƠNG THỨC LỖI
                res.status(500).json({status: false, message: 'Internal server failed'});
            }
        }
    }

    // ADMIN DELETE LOCATION
    deleteLocation = async (req, res, next) => {
        let { location } = req.body;
        let { errors } = validationResult(req);

        if(errors.length) {
            res.status(406).json({status: false, message: errors[0].msg});

        } else {
            try {
                // THỰC HIỆN XOÁ LOCATION THÔNG QUA ID
                let locationInfor = await ModelLocation.findById(location);

                // THỰC HIỆN XOÁ ẢNH TRƯỚC KHI XOÁ MODEL
                if(locationInfor.images.length) {
                    for(let image of locationInfor.images) {
                        let imageName = image.split('/').splice(-1).join('').split(".")[0];

                        // THUC HIEN KIEM TRA XEM FILE CO TON TAI TREN CLOUD
                        let {status, result } = await UtilCloudinary.exists(`booking/${imageName}`);
                        if(status) {
                            await UtilCloudinary.destroy(`booking/${imageName}`);
                        }
                    }
                }

                // THỰC HIỆN XOÁ MODEL LOCATION
                await locationInfor.deleteOne();
                res.status(200).json({status: true, message: 'Delete location successfully'});                

            } catch (error) {
                // PHƯƠNG THỨC LỖI
                res.status(500).json({status: false, message: 'Internal server failed'});
            }
        }
    }

    // ADMIN XOÁ ẢNH LOCATION
    deletePhoto = async (req, res, next) => {
        let { errors } = validationResult(req);

        if(errors.length) {
            res.status(406).json({status: false, message: errors[0].msg});

        } else {
            try {

                let { id, photo } = req.body;
                let locationInfor = await ModelLocation.findById(id);
    
                // KIỂM TRA ẢNH CÓ TỒN TẠI THỰC HIỆN XOÁ
                if(locationInfor.images.length) {

                    for(let image of locationInfor.images) {
                        if(image === photo) {
                            let imageName = image.split('/').splice(-1).join('').split(".")[0];

                            // THUC HIEN KIEM TRA XEM FILE CO TON TAI TREN CLOUD
                            let {status, result } = await UtilCloudinary.exists(`booking/${imageName}`);
                            if(status) {
                                await UtilCloudinary.destroy(`booking/${imageName}`);
                                break;
                            }
                        }
                    }
                }
    
                // THỰC HIỆN XOÁ ẢNH TRONG MODEL
                locationInfor.images = locationInfor.images.filter((image) => image !== photo);
                await locationInfor.save();
                res.status(200).json({status: true, messgae: 'Delete photo location successfully'});
    
            } catch (error) {
                // PHƯƠNG THỨC LỖI
                res.status(500).json({status: false, message: 'Internal server failed'});
            }
        }
    }

}

module.exports = new ControllerLocation();