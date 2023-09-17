const ModelBooking = require("../../model/model-booking");

class ControllerBooking {

    constructor() { }

    // LẤY DANH SÁCH HOẠT ĐỘNG BÔKING HIỆN CÓ
    getBookingAmount = async(req, res, next) => {
        try {
            let amountBooking = await ModelBooking.find({}).count().exec();
            res.status(200).json({
                status: true,
                message: 'Amount booking successfully',
                amount: amountBooking
            });

        } catch (error) {
            // PHƯƠNG THỨC LỖI
            res.status(500).json({status: false, message: "Internal server failed"});
        }
    }

    // HIỂN THỊ DANH SÁCH KHÁCH HÀNG BOKKING SỐ LƯỢNG ĐƯỢC CHỈ ĐỊNH
    getBooking = async (req, res, next) => {
        try {
            let { limit, start } = req.params;
            let bookingsInfor = await ModelBooking.find({}).limit(limit).skip(start).populate(['hotel']).exec();
            res.status(200).json({
                status: true,
                message: 'Get booking successfull',
                bookings: bookingsInfor
            });

        } catch (error) {
            // PHƯƠNG THỨC LỖI
            res.status(500).json({status: false, message: 'Internal server failed'});
        }
    }


}

module.exports = new ControllerBooking();