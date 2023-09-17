const ModelHotel = require("../../model/model-hotel");

class ControllerHotel {

    constructor() { }

    // TÌM DANH SÁCH TẤT CẢ CÁC HOTEL
    getHotel = async (req, res, next) => {
        try {
            let hotelsInfor = await ModelHotel.find({}).populate(["name", "city", "images", "price"]);
            res.status(200).json({
                status: true,
                message: "Get location done",
                hotels: hotelsInfor
            })

        } catch (error) {
            // PHƯƠNG THỨC LỖI
            res.status(500).json({status: false, message: 'Internal server failed'});
        }
    }

    // TÌM HOTEL THEO ID CHỈ ĐỊNH
    getHotelById = async (req, res, next) => {
        try {
            let { hotel } = req.params;
            let hotelInfor = await ModelHotel.findById(hotel).populate(["rooms"]).exec();
            res.status(200).json({
                status: true,
                message: "Get location done",
                hotel: hotelInfor
            })

        } catch (error) {
            // PHƯƠNG THỨC LỖI
            res.status(500).json({status: false, message: 'Internal server failed'});
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