const ModelBooking = require("../../model/model-booking");
const { validationResult } = require('express-validator');

class ControllerBooking {

    constrcutor() { }

    // KHÁCH HÀNG TRUY CẬP THÔNG TIN GIAO DỊCH ĐÃ THỰC HIỆN
    userFindHistoryTransactionBooking = async (req, res, next) => {
        try {
            let { user } = req;

            let bookings = user.bookings.map((elm) => elm._id);
            let bookingInfor = await ModelBooking.find({_id: {$in: bookings}}).populate(['hotel', 'room']).exec();

            res.status(200).json({
                status: true,
                message: "Find booking successfully",
                user,
                bookings: bookingInfor
            });

        } catch (error) {
            // PHƯƠNG THỨC LỖI
            res.status(500).json({status: false, message: 'Internal server failed'});
        }
    }

    // KHÁCH HÀNG ĐẶT PHÒNG
    userBookingRoom = async (req, res, next) => {
        let { errors } = validationResult(req);

        if(errors.length) {
            res.status(406).json({status: false, message: errors[0].msg});

        } else {
            try {
                let { fullName, email, phone, card, payment, startDate, endDate, quantityDateBooking, roomNumbers } = req.body;
                let { user, hotel, room } = req;
    
                if(user && hotel && room) {
                    // TÍN GIÁ TIỀN CHO KHÁCH HÀNG
                    let price = (Number(room.price.toString()) * roomNumbers.length) * quantityDateBooking;
    
                    // THỰC HIỆN LUW THÔNG TIN
                    let bookingInfor = await ModelBooking.create({
                        fullName, user,
                        phone, email,
                        startDate: new Date(startDate),
                        endDate: new Date(endDate),
                        price, payment,
                        hotel, room,
                        roomNumbers
                    })
    
                    // TẠO LIÊN KẾT GIỮA BÔKING VÀ USER 
                    user.bookings.push(bookingInfor);
                    await user.save();
    
                    // LƯU THÔNG TIN BOOKING THÀNH CÔNG
                    res.status(200).json({status: true, message: 'User booking successfully'});
    
                } else {
                    // THIẾU THÔNG TIN USER - HOTEL - ROOM KHÔNG THỰC HIÊN CHỨC NĂNG
                    res.status(404).json({status: false, message: 'Missing information not booking hotel'});
    
                }
    
            } catch (error) {
                // PHƯƠNG THỨC LỖI
                res.status(500).json({status: false, message: 'Internal server failed'});
            }
        }
    }

}

module.exports = new ControllerBooking();