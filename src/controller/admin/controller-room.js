const ModelRoom = require("../../model/model-room");
const ModelHotel = require("../../model/model-hotel");
const { validationResult } = require("express-validator");
const path = require('path');
const fs = require("fs");

class ControllerRoom {

    constructor() { }

    // ADMIN LẤY TẤT CẢ CÁC ROOM HIỆN CÓ - SỐ LƯỢNG CHỈ ĐỊNHs
    getRooms = async (req, res, next) => {
        try {
            let { limit, start} = req.params;
            let roomInfor = await ModelRoom.find({}).limit(limit).skip(start).exec();
            res.status(200).json({status: true, rooms: roomInfor, message: 'Find roles successfully'});

        } catch (error) {
            res.status(500).json({status: false, message: 'Internal server failed'});

        }
    }

    // LÂY SỐ LƯỢNG ROOM HIỆN CÓ
    getRoomAmount = async (req, res, next) => {
        try {
            let amountRoom = await ModelRoom.find({}).count().exec();
            res.status(200).json({
                status: true,
                message: 'Amount room successfully',
                amount: amountRoom
            });

        } catch (error) {
            res.status(500).json({status: false, message: 'Internal server failed'});
        }
    }

    // ADMIN LẤY TẤT CẢ CÁC ROOM HIỆN CÓ
    findRooms = async (req, res, next) => {
        try {
            let roomsInfor = await ModelRoom.find({});
            res.status(200).json({
                status: true,
                message: 'Find room successfully',
                rooms: roomsInfor
            });

        } catch (error) {
            res.status(500).json({status: false, message: 'Internal server failed'});
        }
    }

    // ADMIN LẤY ROOM THEO ID
    findRoombyId = async (req, res, next) => {
        try {
            let { room } = req.params;

            // LẤY THÔNG TIN CỦA ROOM
            let roomInfor = await ModelRoom.findById(room);
            res.status(200).json({ status: true, message: 'Find room successfully', room: roomInfor });

        } catch (error) {
            // PHƯƠNG THỨC LỖI
            res.status(500).json({status: false, message: 'Internal server failed'});
        }
    }

    // ADMIN LẤY THÔNG TIN THỰC HIỆN LIÊN KẾT GIỮA ROOM VÀ HOTEL
    findRoomInforLink = async(req, res, next) => {
        try {
            let { room, hotels} = req;
            res.status(200).json({status: true, message: "Find infor success", room, hotels});

        } catch (error) {
            // PHƯƠNG THỨC LỖI
            res.status(true).json({status: false, message: 'Internal server failed'});
        }
    }

    // ADMIN TẠO MỚI THÔNG TIN ROOM CỦA HOTEL
    createRoom = async (req, res, next) => {
        let { errors } = validationResult(req);

        if(errors.length) {
            res.status(406).json({status: false, message: errors[0].msg});

        } else {
            try {
                let { title, price, desc, maxPeople, roomNumber } = req.body;
                let { files } = req;

                // LẤY THÔNG TIN DANH SÁCH HÌNH ẢNH ROOM.
                let paths = [];
                if(files.length) {
                    paths = files.map((image) => {
                        return `images/${image.filename}`;
                    })
                }

                // ĐẶT SỐ PHÒNG CHO ROOM
                let roomsNumber = [];
                roomNumber.toString().split(",").forEach((numberRoom) => {
                    roomsNumber.push(numberRoom.toString().trim());
                })

                // THỰC HIỆN TẠO MỚI ROOM
                await ModelRoom.create({title, price, maxPeople, desc, roomNumbers: roomsNumber, images: paths});
                res.status(200).json({status: true, message: 'Create room done'});

            } catch (error) {
                // PHUONG THỨC LỖI
                res.status(500).json({status: false, message: "Internal server failed"});
            }
        }
    }

    // ADMIN THỰC HIỆN TẠO LIÊN KẾT GIỮA ROOM VÀ HOTEL
    createLinkRoomToHotel = async (req, res, next) => {
        let { errors } = validationResult(req);

        if(errors.length) {
            res.status(406).json({status: false, message: errors[0].msg});

        } else {
            try {
                let { room, hotel } = req;
                // THỰC HIỆN TẠO LIÊN KẾT GIỮA ROOM VÀ HOTEL
                room.hotels.push(hotel);
                hotel.rooms.push(room);

                await room.save();
                await hotel.save();
                res.status(200).json({status: true, message: 'Link room to hotel successfully'});

            } catch (error) {
                // PHUONG THỨC LỖI
                res.status(500).json({status: false, message: "Internal server failed"});
            }
        }
    }

    // ADMIN SỬA THÔNG TIN ROOM
    modifiRoom = async (req, res, next) => {
        let { errors } = validationResult(req);
        if(errors.length) {
            res.status(406).json({status: false, message: errors[0].msg});

        } else {
            try {

                let { title, price, desc, maxPeople, roomNumber } = req.body;
                let { room } = req;
                let { files } = req;

                // LẤY THÔNG TIN DANH SÁCH HÌNH ẢNH ROOM.
                let paths = [];
                if(files.length) {
                    paths = files.map((image) => {
                        return `images/${image.filename}`;
                    })

                    // THỰC HIỆN THÊM PHOTO VÀO ROOM
                    for(let path of paths) {
                        room.images.push(path);
                    }
                }

                // ĐẶT LẠI SỐ PHÒNG CHO ROOM
                roomNumber.toString().split(",").forEach((numberRoom) => {
                    room.roomNumbers.push(numberRoom.toString().trim());
                })

                room.title = title;
                room.price = price;
                room.desc = desc;
                room.maxPeople = maxPeople;

                // CẬP NHẬT THÔNG TIN ROOM THÀNH CÔNG
                await room.save();
                res.status(200).json({status: true, message: 'Update room successfully'});



            } catch (error) {
                // PHƯƠNG THỨC LỖI
                res.status(500).json({status: false, message: "Inetrnal server failed"});
            }
        }
    }

    // ADMIN XOÁ ROOM
    deleteRoom = async (req, res, next) => {
        let { errors } = validationResult(req);

        if(errors.length) {
            res.status(406).json({status: false, message: errors[0].msg});

        } else {
            try {
                let { room } = req.body;
                
                 // THỰC HIỆN XOÁ LOCATION THÔNG QUA ID
                 let roomInfor = await ModelRoom.findById(room);

                 // THỰC HIỆN XOÁ ẢNH TRƯỚC KHI XOÁ MODEL
                 if(roomInfor.images.length) {
                     for(let image of roomInfor.images) {
                         let fileExists = fs.existsSync(path.join(__dirname, "../../", "public", image));
                         if(fileExists) {
                             fs.unlinkSync(path.join(__dirname, "../../", "public", image));
                         }
                     }
                 }
 
                 // THỰC HIỆN XOÁ MODEL LOCATION
                 await roomInfor.deleteOne();
                 res.status(200).json({status: true, message: 'Delete room successfully'});

            } catch (error) {
                // PHƯƠNG THỨC LỖI
                res.status(500).json({status: false, message: "Internal server failed"});
            }
        }
    }

    //  ADMIN XOÁ ẢNH MÔ TẢ CỦA ROOM
    deletePhoto = async (req, res, next) => {
        try {

            let { id, photo } = req.body;

            let roomInfor = await ModelRoom.findById(id);
            let photoPath = path.join(__dirname, "../../", "public", photo);

            // KIỂM TRA ẢNH CÓ TỒN TẠI THỰC HIỆN XOÁ
            let imageExists = fs.existsSync(photoPath);
            if(imageExists) {
                fs.unlinkSync(photoPath);
            }

            // THỰC HIỆN XOÁ ẢNH TRONG MODEL
            roomInfor.images = roomInfor.images.filter((image) => image !== photo);
            await roomInfor.save();
            res.status(200).json({status: true, messgae: 'Delete photo location successfully'});

        } catch (error) {
            res.status(500).json({status: false, message: 'Internal server failed'});
        }
    }

}

module.exports = new ControllerRoom();