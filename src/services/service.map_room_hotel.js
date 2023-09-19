"use strict"
const ModelHotel = require("../model/model-hotel");
const ModelRoom = require("../model/model-room");

class ServiceMapRoomHotel {

    constructor() { }

    // TẠO LIÊN KẾT GIỮA ROOM VÀ HOTEL
    async joinRoomToHotel(roomId, hotelId, cb) {
        try {
            let hotel = await ModelHotel.findById(hotelId).exec();
            let room = await ModelRoom.findById(roomId).exec();

            hotel.rooms.push(room);
            room.hotel = hotel;

            await hotel.save();
            await room.save();

            cb({status: true, message: 'Join room to hotel successfully'});

        } catch (error) {
            // THỰC HIỆN PHƯƠNG THỨC LỖI
            cb({status: false, message: 'Method failed', error});
        }
    }

    // HUỶ LIÊN KẾT GIỮA RÔM VÀ HOTEL
    async destroyRoomToHotel(roomId, hotelId, cb) {
        try {
            let hotel = await ModelHotel.findById(hotelId).exec();
            let room = await ModelRoom.findById(roomId).exec();

            hotel.rooms = hotel.rooms.filter((roomInfor) => roomInfor.toString() !== room);
            room.hotel = null;

            await hotel.save();
            await room.save();

            cb({status: true, message: 'Join room to hotel successfully'});

        } catch (error) {
            // THỰC HIỆN PHƯƠNG THỨC LỖI
            cb({status: false, message: 'Method failed', error});
        }
    }

}

module.exports = new ServiceMapRoomHotel();