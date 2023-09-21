"use strict"
const mongodb = require("mongodb");
const ModelBooking = require("../model/model-booking");
const ObjectId = mongodb.ObjectId;

class ServiceBooking {

    constructor() { }

    // TRUY XUẤT DANH SÁCH BOOKING TRANSACTION CỦA USER
    async getBookingTransactionOfUser(user = {}, cb) {
        try {
            let bookings = await ModelBooking.find({user: {$eq: new ObjectId(user._id)}}).sort({createDate: "desc"}).populate(['hotel', 'room']).lean();
            cb({status: true, message: 'Get booking transaction successfully', bookings});

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
                await user.save();

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


  