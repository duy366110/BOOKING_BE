const { validationResult } = require("express-validator");
const path = require('path');
const fs = require('fs');
const ModelHotel = require("../../model/model-hotel");
const ModelRoom = require("../../model/model-room");
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
                    // // THỰC HIỆN TÌM KIẾM VÀ CẬP NHẬT
                    // // 1) CẬP NHẬT CITY
                    // if(hotel.city._id.toString() !== location._id.toString()) {
                    //     // THỰC HIỆN XOÁ LIÊN KẾT CŨ
                    //     let oldLocation = hotel.city;
                    //     oldLocation.collections = oldLocation.collections.filter((city) => city._id.toString() !== hotel._id.toString());
                    //     await oldLocation.save();

                    //     // CẬP NHẬT LIÊN KẾT MỚI
                    //     location.collections.push(hotel);
                    //     await location.save();

                    //     // CẬP NHẬT LOCATION MỚI CHO HOTEL
                    //     hotel.city = location;
                    // }

                    // // 2) CẬP NHẬT TYPE
                    // if(hotel.type._id.toString() !== category._id.toString()) {
                    //     // THỰC HIỆN XOÁ LIÊN KẾT CŨ
                    //     let oldType = hotel.type;
                    //     oldType.collections = oldType.collections.filter((type) => type.toString() !== hotel._id.toString());
                    //     await oldType.save();

                    //     // CẬP NHẬT LIÊN KẾT MỚI
                    //     category.collections.push(hotel);
                    //     await category.save();

                    //     // CẬP NHẬT CATEGORY MỚI CHO HOTEL
                    //     hotel.type = category;
                    // }

                    // LẤY THÔNG TIN DANH SÁCH HÌNH ẢNH HOTEL.
                    // if(files.length) {
                    //     files.map((image) => {
                    //         hotel.images.push(`images/${image.filename}`);
                    //     })
                    // }

                    // 3) CẬP NHẬT INFOR HOTEL
                    // hotel.name = name;
                    // hotel.address = address;
                    // hotel.distance = distance;
                    // hotel.desc = desc;
                    // hotel.feature = feature;
                    // hotel.price = price;

                    // await hotel.save();
                    // res.status(200).json({status: true, message: 'Update hotel information successfully'});

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
                    let {city, type} = hotel;

                    // THỰC HIỆN XOÁ LIÊN KẾT HOTEL VỚI CITY - LOCATION
                    city.collections = city.collections.filter((elm) => elm.toString() !== hotel._id.toString());
                    await city.save();

                    // THỰC HIỆN XOÁ LIÊN KẾT HOTEL VỚI TYPE = CATEGORY
                    type.collections = type.collections.filter((elm) => elm.toString() !== hotel._id.toString());
                    await type.save();

                    // THỰC HIỆN XOÁ HÌNH ẢNH
                    if(hotel.images.length) {
                        hotel.images.forEach((photo) => {
                            if(fs.existsSync(path.join(__dirname, "../../", 'public', photo))) {
                                fs.unlinkSync(path.join(__dirname, "../../", 'public', photo));
                            }
                        })
                    }

                    // THỰC HIẸN XOÁ HOTEL
                    await hotel.deleteOne();
                    res.status(200).json({status: true, message: "Delete hotel successfully"});

                } else {
                    res.status(404).json({status: false, message: 'Not found hotel'});
                }

            } catch (error) {
                // PHUONG THỨC LỖI
                res.status(500).json({status: false, message: 'Internal server failed'});
            }
        }
    }

    // ADMIN XOÁ ROOM LIÊN KẾT VỚI HOTEL - chua cap nhat
    deleteRoomOfHotel = async (req, res, next) => {
        try {
            let { hotel, room } = req.body;

            let hotelInfor = await ModelHotel.findById(hotel).populate("rooms").exec();
            let roomInfor = hotelInfor.rooms.find((elm) => elm._id.toString() === room);

            // THỰC HIỆN XOÁ LIÊN GIỮA ROOM VÀ HOTEL
            roomInfor.hotels = roomInfor.hotels.filter((elm) => elm.toString() !== hotel);
            hotelInfor.rooms = hotelInfor.rooms.filter((elm) => elm._id.toString() !== room);

            await roomInfor.save();
            await hotelInfor.save();


            res.status(200).json({status: true, message: 'Delete room of hotel successfully'});

        } catch (error) {
            res.status(500).json({status: false, message: 'Internal server failed'});

        }
    }

    // ADMIN XOÁ PHÔT CỦA HOTEL
    deletePhoto = async (req, res, next) => {
        try {

            let { id, photo } = req.body;
            // TÌM KIẾM THÔNG TIN HOTEL CẦN XOÁ
            let hotelInfor = await ModelHotel.findById(id).select('images');

            if(photo) {
                // KIỂM TRA VÀ XOÁ ẢNH
                let status = fs.existsSync(path.join(__dirname, "../../", "public", photo));
                if(status) {
                    fs.unlinkSync(path.join(__dirname, "../../", "public", photo));
                    hotelInfor.images = hotelInfor.images.filter((elm) => elm !== photo);
                }
                await hotelInfor.save();
            }

            res.status(200).json({status: true, message: 'Delete photo done'});

        } catch (error) {
            res.status(500).json({status: false, message: 'Internal server failed'});
        }
    }
}

module.exports = new ControllerHotel();