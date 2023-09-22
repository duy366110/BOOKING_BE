"use strict"
const ModelBooking = require("../../model/model-booking");
const ServiceBooking = require("../../services/service.booking");

class ControllerBooking {

    constructor() { }

    // LẤY DANH SÁCH HOẠT ĐỘNG BÔKING HIỆN CÓ
    getAmount = async(req, res, next) => {
        try {
            await ServiceBooking.getAmount((information) => {
                let { status, message, amount, error } = information;
                if(status) {
                    res.status(200).json({status: true, message, amount});

                } else {
                    res.status(406).json({status: false, message, error});
                }
            })

        } catch (error) {
            res.status(500).json({status: false, message: 'Internal server failed'});
        }
    }

    // HIỂN THỊ DANH SÁCH KHÁCH HÀNG BOKKING SỐ LƯỢNG ĐƯỢC CHỈ ĐỊNH
    getBooking = async (req, res, next) => {
        try {
            let { limit, start} = req.params;
            await ServiceBooking.getLimit(limit, start, (information) => {
                let { status, message, bookings, error } = information;
                if(status) {
                    res.status(200).json({status: true, message, bookings});

                } else {
                    res.status(406).json({status: false, message, error});
                }
            });

        } catch (error) {
            // PHƯƠNG THỨC LỖI
            res.status(500).json({status: false, message: 'Internal server failed'});
        }
    }


}

module.exports = new ControllerBooking();