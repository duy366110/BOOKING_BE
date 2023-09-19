"use strict"
const { validationResult } = require("express-validator");
const ModelRoom = require("../../model/model-room");
const ServiceRoom = require("../../services/service.room");

class ControllerRoom {

    constructor() { }

    // TRUY XUẤT CẢ CÁC ROOM HIỆN CÓ - SỐ LƯỢNG CHỈ ĐỊNHs
    getRooms = async (req, res, next) => {
        try {
            let { limit, start} = req.params;
            await ServiceRoom.getLimit(limit, start, (information) => {
                let { status, message, rooms, error } = information;
                if(status) {
                    res.status(200).json({status: true, message, rooms});

                } else {
                    res.status(406).json({status: false, message, error});
                }
            });

        } catch (error) {
            // PHƯƠNG THỨC LỖI
            res.status(500).json({status: false, message: 'Internal server failed'});

        }
    }

    // TRUY XUẤT DANH SÁCH ROOM
    getRoomAll = async (req, res, next) => {
        try {
            await ServiceRoom.getAll((information) => {
                let { status, message, rooms, error } = information;
                if(status) {
                    res.status(200).json({status: true, message, rooms});

                } else {
                    res.status(406).json({status: false, message, error});
                }
            });

        } catch (error) {
            // PHƯƠNG THỨC LỖI
            res.status(500).json({status: false, message: 'Internal server failed'});
        }
    }

    // ADMIN TRUY XUẤT ROOM THEO ID
    getRoombyId = async (req, res, next) => {
        try {
            let { room } = req.params;
            await ServiceRoom.getById(room, (information) => {
                let { status, message, room, error } = information;
                if(status) {
                    res.status(200).json({status: true, message, room});

                } else {
                    res.status(406).json({status: false, message, error});
                }
            })

        } catch (error) {
            // PHƯƠNG THỨC LỖI
            res.status(500).json({status: false, message: 'Internal server failed'});
        }
    }

    // TRUY XUẤT LƯỢNG ROOM HIỆN CÓ
    getAmount = async (req, res, next) => {
        try {
            await ServiceRoom.getAmount((information) => {
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

    // ADMIN TẠO MỚI THÔNG TIN ROOM
    createRoom = async (req, res, next) => {
        let { errors } = validationResult(req);

        if(errors.length) {
            res.status(406).json({status: false, message: errors[0].msg});

        } else {
            try {
                let { title, price, desc, maxPeople, roomNumber } = req.body;
                let { files } = req;

                // LẤY THÔNG TIN DANH SÁCH HÌNH ẢNH ROOM.
                let images = [];
                if(files.length) {
                    images = files.map((image) => {
                        return image.path? image.path : '';
                    })
                }

                // ĐẶT SỐ PHÒNG CHO ROOM
                let roomsNumber = [];
                roomNumber.toString().split(",").forEach((numberRoom) => {
                    roomsNumber.push(numberRoom.toString().trim());
                })

                // TẠO MỚI THÔNG TIN ROOM
                await ServiceRoom.create({title, price, maxPeople, desc, roomsNumber}, images, (information) => {
                    let { status, message, error } = information;
                    if(status) {
                        res.status(200).json({status: true, message});

                    } else {
                        res.status(406).json({status: false, message, error});
                    }
                })

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
                let images = [];
                if(files.length) {
                    images = files.map((image) => {
                        return image.path? image.path : '';
                    })
                }

                // ĐẶT SỐ PHÒNG CHO ROOM
                let roomsNumber = [];
                if(roomNumber) {
                    roomNumber.toString().split(",").forEach((numberRoom) => {
                        roomsNumber.push(numberRoom.toString().trim());
                    })
                }

                await ServiceRoom.update({model: room, title, price, maxPeople, desc, roomsNumber}, images, (information) => {
                    let { status, message, error } = information;
                    if(status) {
                        res.status(200).json({status: true, message});

                    } else {
                        res.status(406).json({status: false, message, error});
                    }
                })

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
                
                 // THỰC HIỆN XOÁ ROOM THÔNG QUA ID
                 let roomInfor = await ModelRoom.findById(room);

                await ServiceRoom.delete({model: roomInfor}, (information) => {
                    let { status, message, error } = information;
                    if(status) {
                        res.status(200).json({status: true, message});

                    } else {
                        res.status(406).json({status: false, message, error});
                    }
                })

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

            await ServiceRoom.deleteImage({model: roomInfor}, photo, (information) => {
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

module.exports = new ControllerRoom();