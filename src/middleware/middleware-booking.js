const ModelUser = require("../model/model-user");
const ModelHotel = require("../model/model-hotel");
const JWT = require("../util/util.jwt");

class MiddlewareBooking {

    constructor() { }

    // TÌM THÔNG TIN USER - HOTEL - ROOM THỰC HIỆN ĐẶT PHONG
        // TÌM THÔNG TIN NGƯỜI DÙNG
        findUserBooking = async(req, res, next) => {
            try {
                let { token } = req.body;
                
                // KIỂM TRA TOKEN CÓ HỢP LỆ
                JWT.verify(token, async (information) => {
                    let { status, message, infor } = information;
                    if(status) {
                        // TÌM TÀI KHOẢN NGƯỜI DÙNG BOOKING HOTEL - ROOM
                        let userInfor = await ModelUser.findOne({email: {$eq: infor.email}});
                        req.user = userInfor;
                        next();

                    } else {
                        // TOKEN HẾT HẠN
                        res.status(406).json({status: false, message: 'Token expirce'});
                    }
                })

            } catch (error) {
                // PHƯƠNG THỨC LỖI
                res.status(500).json({status: false, message: 'Internal server failed'});
            }
        }

        // TÌM THÔNG TIN HOTEL - RÔM CẦN BOOKING
        findHotelRoomBooking = async (req, res, next) => {
            try {
                let { hotel, room } = req.body;
                let hotelInfor = await ModelHotel.findById(hotel).populate(['rooms']).exec();
                let roomInfor = hotelInfor.rooms.find((roomHotel) => roomHotel._id.toString() === room);

                req.hotel = hotelInfor;
                req.room = roomInfor;
                next();

            } catch (error) {
                // PHƯƠNG THỨC LỖI
                res.status(500).json({status: false, message: 'Internal server failed'});
            }
        }

}

module.exports = new MiddlewareBooking();