"use strict"
const ModelRoom = require("../model/model-room");
const UtilCloudinary = require("../util/util.cloudinary");
const ConfigEnv = require("../configs/config.env");

class ServiceRoom {

    constructor() { }

    // LẤY DANH SÁCH ROOM
    async getLimit(limit, start, cb) {
        try {
            let rooms = await ModelRoom.find({}).sort({createDate: 'desc'}).limit(limit).skip(start).populate(['hotel']).lean();
            cb({status: true, message: 'Get rooms successfully', rooms});

        } catch (error) {
            // THỰC HIỆN PHƯƠNG THỨC LỖI
            cb({status: false, message: 'Method failed', error});
        }
    }

    // LẤY DANH SÁCH ROOM
    async getAll(cb) {
        try {
            let rooms = await ModelRoom.find({}).lean();
            cb({status: true, message: 'Get rooms successfully', rooms});

        } catch (error) {
            // THỰC HIỆN PHƯƠNG THỨC LỖI
            cb({status: false, message: 'Method failed', error});
        }
    }

    // TRUY XUẤT ROOM TỬ THEO ID
    async getById(id, cb) {
        try {
            let room = await ModelRoom.findById(id).populate(['hotel']).lean();
            cb({status: true, message: 'Get room successfully', room});

        } catch (error) {
            // THỰC HIỆN PHƯƠNG THỨC LỖI
            cb({status: false, message: 'Method failed', error});
        }
    }

    // LẤY SỐ LƯỢNG ROOM
    async getAmount(cb) {
        try {
            let amount = await ModelRoom.find({}).count().lean();
            cb({status: true, message: 'Get amount room successfully', amount});

        } catch (error) {
            // THỰC HIỆN PHƯƠNG THỨC LỖI
            cb({status: false, message: 'Method failed', error});
        }
    }

    // TẠO MỚI ROOM
    async create(room = {}, images, cb) {
        try {
            await ModelRoom.create({
                title: room.title,
                price: room.price,
                maxPeople: room.maxPeople,
                desc: room.desc,
                roomNumbers: room.roomsNumber,
                images
            });

            cb({status: true, message: 'Create room successfully'});

        } catch (error) {
            // THỰC HIỆN PHƯƠNG THỨC LỖI
            cb({status: false, message: 'Method failed', error});
        }
    }

    // CẬP NHẬT ROOM
    async update(room = {}, images = [], cb) {
        try {

            if(images.length) {
                for(let image of images) {
                    room.model.images.push(image);
                }
            }

            // ĐẶT LẠI SỐ PHÒNG CHO ROOM
            if(room.roomsNumber.length) {
                room.roomsNumber.forEach((numberRoom) => {
                    room.model.roomNumbers.push(numberRoom);
                })
            }

            room.model.title = room.title;
            room.model.price = room.price;
            room.model.desc = room.desc;
            room.model.maxPeople = room.maxPeople;
            room.model.updateDate = new Date();
            await room.model.save();

            cb({status: true, message: 'Update room successfully'});

        } catch (error) {
            // THỰC HIỆN PHƯƠNG THỨC LỖI
            cb({status: false, message: 'Method failed', error});
        }
    }

    // XOÁ CATEGORY
    async delete(room = {}, cb) {
        try {
            
            if(room.model.images.length) {
                let images = [];
                for(let image of room.model.images) {
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

            await room.model.deleteOne();
            cb({status: true, message: 'Update room successfully'});

        } catch (error) {
            // THỰC HIỆN PHƯƠNG THỨC LỖI
            cb({status: false, message: 'Method failed', error});
        }
    }


    // XOÁ ẢNH ROOM
    async deleteImage(room = {}, photo = '', cb) {
        try {

            // KIỂM TRA ẢNH CÓ TỒN TẠI THỰC HIỆN XOÁ
            if(room.model.images.length) {

                for(let image of room.model.images) {
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
             room.model.images =  room.model.images.filter((image) => image !== photo);
            await  room.model.save();

            cb({status: true, message: 'Delete photo image successfully'});

        } catch (error) {
            // THỰC HIỆN PHƯƠNG THỨC LỖI
            cb({status: false, message: 'Method failed', error});
        }
    }
}

module.exports = new ServiceRoom();


  