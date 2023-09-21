"use strict"
const ModelBooking = require("../model/model-booking");

class ServiceBooking {

    constructor() { }

    // LẤY DANH SÁCH LOCATION
    async getLimit(limit, start, cb) {
        try {
            let categories = await ModelBooking.find({}).sort({createDate: 'desc'}).limit(limit).skip(start).lean();
            cb({status: true, message: 'Get categories successfully', categories});

        } catch (error) {
            // THỰC HIỆN PHƯƠNG THỨC LỖI
            cb({status: false, message: 'Method failed', error});
        }
    }

    // LẤY DANH SÁCH LOCATION
    async getAll(cb) {
        try {
            let categories = await ModelBooking.find({}).lean();
            cb({status: true, message: 'Get categories successfully', categories});

        } catch (error) {
            // THỰC HIỆN PHƯƠNG THỨC LỖI
            cb({status: false, message: 'Method failed', error});
        }
    }

    // LẤY DANH PHẦN TỬ THEO ID
    async getById(id, cb) {
        try {
            let category = await ModelBooking.findById(id).lean();
            cb({status: true, message: 'Get category category successfully', category});

        } catch (error) {
            // THỰC HIỆN PHƯƠNG THỨC LỖI
            cb({status: false, message: 'Method failed', error});
        }
    }

    // LẤY SỐ LƯỢNG CATEGORY
    async getAmount(cb) {
        try {
            let amount = await ModelBooking.find({}).count().lean();
            cb({status: true, message: 'Get amount category successfully', amount});

        } catch (error) {
            // THỰC HIỆN PHƯƠNG THỨC LỖI
            cb({status: false, message: 'Method failed', error});
        }
    }

    // TẠO MỚI BOOKING
    async create(booking = {}, user, hotel, cb) {

        try {
            let bookingInfor = await ModelBooking.create({
                fullName: booking.fullName,
                email: booking.email,
                phone: booking.phone,
                card: booking.card,
                payment: booking.payment,
                startDate: new Date(booking.startDate),
                endDate: new Date(booking.endDate),
                quantityDateBooking: booking.quantityDateBooking,
                price: booking.price,
                roomNumbers: booking.roomNumbers,
                user, hotel, room: hotel.rooms[0]
            });

            if(bookingInfor) {
                user.bookings.push(bookingInfor);
                cb({status: true, message: 'Create booking successfully'});

            } else {
                cb({status: false, message: 'Create booking unsuccessfully', error: null});

            }

        } catch (error) {
            // THỰC HIỆN PHƯƠNG THỨC LỖI
            cb({status: false, message: 'Method failed', error});
        }
    }
}

module.exports = new ServiceBooking();


  