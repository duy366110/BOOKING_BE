const ModelRoom = require("../model/model-room");
const ModelHotel = require("../model/model-hotel");

class MiddlewareRoom {

    constrcutor() { }

    // ROOM TÌM KIẾM MODEL HOTEL CẦN CẬP NHẬT SỐ PHÒNG
    roomFindByIdClearRoomNumber = async(req, res, next) => {
        try {
            let { room } = req.body;
            let roomInfor = await ModelRoom.findById(room);
            // THỰC HIỆN XOÁ ROOM NUMBER TRƯỚC KHI CẬP NHẬT
            roomInfor.roomNumbers = [];
            await roomInfor.save();

            req.room = roomInfor;
            next();

        } catch (error) {
            res.status(500).json({status: false, message: "Internal server failed"});
        }
    }

    // TÌM MODEL ROOM BAO GỒM LIÊN KẾT VỚI HOTEL ĐỂ TẠO LIÊN KẾT GIỮA ROOM VÀO HOTEL
    roomLinkFindById = async (req, res, next) => {
        try {
            let { room } = req.params;
            let roomInfor = await ModelRoom.findById(room).populate('hotels').exec();
            req.room = roomInfor;
            next();

        } catch (error) {
            // PHƯƠNG THỨC LỖI
            res.status(500).json({status: false, message: "Internal server failed"});
        }
    }

    // TÌM HOTEL HIỆN CHƯA LIÊN KẾT VỚI ROOM
    hotelFindNotLinkRoom = async (req, res, next) => {
        try {
            let { room } = req;
            let hotelLinkRoom = room.hotels.map((hotel) => {
                return hotel._id
            })

            let hotelInfor = await ModelHotel.find({_id: {$nin: hotelLinkRoom}});
            req.hotels = hotelInfor;
            next();

        } catch (error) {
            // PHƯƠNG THỨC LỖI
            res.status(500).json({status: false, message: "Internal server failed"});
        }
    }

    // TÌM ROOM THEO YÊU CẦU THỰC HIỆN TẠO LIÊN KẾT
    roomFindById = async(req, res, next) => {
        try {
            let { room } = req.body;
            let roomInfor = await ModelRoom.findById(room);
            req.room = roomInfor;
            next();

        } catch (error) {
            // PHƯƠNG THỨC LỖI
            res.status(500).json({status: false, message: "Internal server failed"});
        }
    }

    // TÌM HOTEL THEO YÊU CẦU THỰC HIỆN TẠO LIÊN KẾT
    hotelFindById = async(req, res, next) => {
        try {
            let { hotel } = req.body;
            let hotelInfor = await ModelHotel.findById(hotel);
            req.hotel = hotelInfor;
            next();

        } catch (error) {
            // PHƯƠNG THỨC LỖI
            res.status(500).json({status: false, message: "Internal server failed"});
        }
    }
}

module.exports = new MiddlewareRoom();