"use strict"
const ModelLocation = require("../../model/model-location");
const ModelHotel = require("../../model/model-hotel");
const ModelRoom = require("../../model/model-room");
const { find } = require("../../model/model-role");


class ControllerSearch {

    constructor() { }

    // CLIENT TÌM KIẾM THÔNG TIN HOTEL - ROOM
    searchHotel = async(req, res, next) => {
        try {
            let { location, startDate, endDate, minPrice, maxPrice, audlt, children, room } = req.body;
            let hotelsInfor = [];
            let roomsInfor = [];


            // PHẢI CÓ THÔNG TIN ĐỊA ĐIỂM THỰC HIỆN TÌM KIẾM THÔNG TIN HOTEL
            if(location) {
                let locationInfor = await ModelLocation.find({title: {$regex: location || '', $options: 'i'}}).lean();

                // LẤY DANH SÁCH HOTEL TẠI ĐỊA ĐIỂM ĐÓ
                let hotels = [];
                for(let location of locationInfor) {
                    hotels.push(...location.collections.map((hotel) => hotel.toString()));
                }

                // LẤY DANH SÁCH PHÒNG CỦA HOTEL THEO YÊU CẦU
                /**
                 * Một phòng có thể thuộc nhiều hotel không thực hiệ query bằng mongodb
                 * vì có thể lẫn các hotel của những địa điểm khác.
                 */

                let maxPeople = (Number(audlt) + Number(children)) || 0 ;
                hotelsInfor = await ModelHotel.find({_id: {$in: hotels}}).populate(['rooms']).lean();

                // TÌM DANH SÁCH PHÒNG THEO - HOTEL TAI ĐỊA ĐIỂM ĐÃ CHỈ ĐỊNH
                if(hotelsInfor.length) {
                    let rooms = hotelsInfor.map((hotel) => {
                        let roomsId = [];
                        hotel.rooms.map((roomInfor) => {
                            roomsId.push(roomInfor._id);
                        })
    
                        return roomsId;
                    })

                    // THỰC HIỆN LỌC DANH SÁCH PHÒNG THEO THÔNG TIN PHÙ HỢP
                    rooms = rooms.flat();
                    roomsInfor = await ModelRoom.find({
                        _id: {$in: rooms},
                        'maxPeople': {$gte: maxPeople},
                        'price': {$gte: minPrice? minPrice : 0, $lte: maxPrice? maxPrice : 1000 }
                    }).lean();

                    // THỰC HIỆN LỌC SỐ LƯỢNG PHÒNG THEO THÔNG YÊU CẦU
                    if(room) {
                        roomsInfor = roomsInfor.filter((elmRoom) => {
                            if(elmRoom.roomNumbers.length >= room) {
                                return elmRoom;
                            }
                        })
                    }
                }
            }

            res.status(200).json({
                code: 200,
                status: true,
                message: 'Search successfully',
                metadata: {
                    rooms: roomsInfor
                }
            })

        } catch (error) {
            res.status(500).json({
                status: false,
                code: 500,
                message: "Internal server failed",
                error
            })
        }
    }

}

module.exports = new ControllerSearch();