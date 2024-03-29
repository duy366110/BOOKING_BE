"use strict"
const { validationResult } = require("express-validator");
const ModelHotel = require("../../model/model-hotel");
const ServiceHotel = require("../../services/service.hotel");

class ControllerHotel {

    constructor() { }

    // LẤY DANH SÁCH HOTEL
    getHotel = async (req, res, next) => {
        try {
            let { limit, start} = req.params;
            await ServiceHotel.getLimit(limit, start, (information) => {
                let { status, message, hotels, error } = information;
                if(status) {
                    res.status(200).json({status: true, message, hotels});

                } else {
                    res.status(406).json({status: false, message, error});
                }
            });

        } catch (error) {
            // PHƯƠNG THỨC LỖI
            res.status(500).json({status: false, message: 'Internal server failed'});
        }
    }

    // TRUY XUẤT DANH SÁCH HOTEL
    getHotelAll = async (req, res, next) => {
        try {
            await ServiceHotel.getAll((information) => {
                let { status, message, hotels, error } = information;
                if(status) {
                    res.status(200).json({status: true, message, hotels});

                } else {
                    res.status(406).json({status: false, message, error});
                }
            });

        } catch (error) {
            // PHƯƠNG THỨC LỖI
            res.status(500).json({status: false, message: 'Internal server failed'});
        }
    }

    // PHƯƠNG THỨC TÌM HOTEL THÔNG QUA ID
    getHotelById = async(req, res, next) => {
        try {
            let { hotel } = req.params;
            await ServiceHotel.getById(hotel, (information) => {
                let { status, message, hotel, error } = information;
                if(status) {
                    res.status(200).json({status: true, message, hotel});

                } else {
                    res.status(406).json({status: false, message, error});
                }
            })

        } catch (error) {
            // PHƯƠNG THỨC LỖI
            res.status(500).json({status: false, message: 'Internal server failed'});;
        }
    }

    // LÂY SỐ LƯỢNG HOTEL HIỆN CÓ
    getAmount = async (req, res, next) => {
        try {
            await ServiceHotel.getAmount((information) => {
                let { status, message, amount, error } = information;
                if(status) {
                    res.status(200).json({status: true, message, amount});

                } else {
                    res.status(406).json({status: false, message, error});
                }
            })

        } catch (error) {
            res.status(500).json({status: false, message: 'Internal server failed'});
        }
    }

    // ADMIN TẠO MỚI THÔNG TIN HOTEL
    creatHotel = async (req, res, next) => {
        let  { errors } = validationResult(req);

        if(errors.length) {
            res.status(406).json({status: false, message: errors[0].msg});

        } else {
            try {

                let { name, address, distance, desc, feature } = req.body;
                let { location , category} = req;
                let { files } = req;

                // LẤY THÔNG TIN DANH SÁCH HÌNH ẢNH HOTEL
                let images = [];
                if(files.length) {
                    images = files.map((image) => {
                        return image.path? image.path : '';
                    })
                }

                // TẠO MỚI THÔNG TIN HOTEL
                await ServiceHotel.create({name, address, distance, desc, feature}, images, location, category, (information) => {
                    let { status, message, error } = information;
                    if(status) {
                        res.status(200).json({status: true, message});

                    } else {
                        res.status(406).json({status: false, message, error});
                    }
                })

            } catch (error) {
                // PHƯƠNG THỨC LỖI
                res.status(500).json({status: false, message: 'Internal server failed'});
            }

        }
    }

    // ADMIN SỬA THÔNG TIN HOTEL
    modifiHotel = async (req, res, next) => {
        let  { errors } = validationResult(req);
        if(errors.length) {
            res.status(406).json({status: false, message: errors[0].msg});

        } else {
            try {
                let { name, address, distance, desc, feature } = req.body;
                let { hotel, location , category} = req;
                let { files } = req;

                if(hotel) {
                    // LẤY THÔNG TIN DANH SÁCH HÌNH ẢNH HOTEL
                    let images = [];
                    if(files.length) {
                        images = files.map((image) => {
                            return image.path? image.path : '';
                        })
                    }

                    await ServiceHotel.update({
                        model: hotel, name, address, distance, desc, feature
                    }, images, location, category, (information) => {
                        let { status, message, error } = information;
                        if(status) {
                            res.status(200).json({status: true, message});
    
                        } else {
                            res.status(406).json({status: false, message, error});
                        }
                    })

                } else {
                    res.status(404).json({status: false, message: 'Not found hotel'});
                }

            } catch (error) {
                // PHƯƠNG THỨC LỖI
                res.status(500).json({status: false, message: "Internal server failed"});
            }
        }
    }

    // ADMIN XOA HOTEL ĐĂNG KÝ
    deleteHotel = async (req, res, next) => {
        let { errors } = validationResult(req);

        if(errors.length) {
            res.status(406).json({status: false, message: errors[0].msg});

        } else {
            try {
                let { hotel } = req;
                if(hotel) {
                    await ServiceHotel.delete({model: hotel}, (information) => {
                        let { status, message, error } = information;
                        if(status) {
                            res.status(200).json({status: true, message});
    
                        } else {
                            res.status(406).json({status: false, message, error});
                        }
                    })

                } else {
                    res.status(404).json({status: false, message: 'Not found hotel'});
                }

            } catch (error) {
                // PHUONG THỨC LỖI
                res.status(500).json({status: false, message: 'Internal server failed'});
            }
        }
    }

    // ADMIN XOÁ PHÔT CỦA HOTEL
    deletePhoto = async (req, res, next) => {
        try {

            let { id, photo } = req.body;
            // TÌM KIẾM THÔNG TIN HOTEL CẦN XOÁ
            let hotelInfor = await ModelHotel.findById(id).exec();

            await ServiceHotel.deleteImage({model: hotelInfor}, photo, (information) => {
                let { status, message, error } = information;
                if(status) {
                    res.status(200).json({status: true, message});

                } else {
                    res.status(406).json({status: false, message, error});
                }
            })

        } catch (error) {
            res.status(500).json({status: false, message: 'Internal server failed'});
        }
    }
}

module.exports = new ControllerHotel();