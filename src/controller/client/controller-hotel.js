"use strict"
const ModelHotel = require("../../model/model-hotel");
const ServiceHotel = require("../../services/service.hotel");

class ControllerHotel {

    constructor() { }

    // TRUY XUẤT DANH MỤC
    getHotel = async (req, res, next) => {
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

    // TRUY XUẤT HOTEL THEO ID
    getHotelById = async (req, res, next) => {
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

    // TÌM HOTEL CÓ ROOM TƯƠNG ỨNG CHO TRANG CHI TIẾT SẢN PHẨM
    getRoomHotelByID = async(req, res, next) => {
        try {
            let { hotel, room } = req.params;
            let hotelInfor = await ModelHotel.findById(hotel).populate(['rooms']).exec();
            let roomInfor = hotelInfor.rooms.find((elm) => elm._id.toString() === room);

            res.status(200).json({
                status: true,
                message: 'Find room in hotel successfully',
                hotel: hotelInfor,
                room: roomInfor
            })

        } catch (error) {
            // PHƯƠNG THỨC LỖI
            res.status(500).json({status: false, message: 'Internal server failed'});
        }
    }

}

module.exports = new ControllerHotel();