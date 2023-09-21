const ModelBooking = require("../../model/model-booking");
const { validationResult } = require('express-validator');
const ServiceBooking = require("../../services/service.booking");

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
    async booking(req, res, next) {
        let { errors } = validationResult(req);

        if(errors.length) {
            res.status(406).json({status: false, message: errors[0].msg});

        } else {
            try {
                let { user, hotel } = req;
                if(user && hotel) {
                    let room = hotel.rooms[0]
                    let { fullName, email, phone, card, payment, startDate, endDate, quantityDateBooking, roomNumbers } = req.body;
                    let price = (Number(room.price.toString()) * roomNumbers.length) * quantityDateBooking;

                    await ServiceBooking.create({
                        fullName, email, phone,
                        card, payment, startDate,
                        endDate, quantityDateBooking, roomNumbers, price
                    }, user, hotel, (information) => {
                        let { status, message, erro } = information;
                        
                        if(status) {
                            res.status(200).json({status: true, message});
        
                        } else {
                            res.status(406).json({status: false, message, error});
                        }
                    })

                } else {
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