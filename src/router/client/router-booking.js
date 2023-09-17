const router = require('express').Router();
const { body } = require("express-validator");
const MiddlewareUser = require("../../middleware/client/middleware-user");
const MiddlewareBooking = require("../../middleware/middleware-booking");
const ControllerBooking = require("../../controller/client/controller-booking");

//ROUTER THỰC HIỆN LẤY THÔNG TRANSACTION BOOKING TRẢ VỀ PHÍA CLIENT
router.get("/", MiddlewareUser.findUserByToken, ControllerBooking.userFindHistoryTransactionBooking);

// ROUTER KHÁCH HÀNG THỰC HIỆN BOOKING HOTEL - ROOM
router.post("/hotel/room", [
    body('hotel').notEmpty().withMessage('Hotel ID not empty'),
    body('room').notEmpty().withMessage('Room ID not empty'),
    body('token').notEmpty().withMessage('Toke user not empty'),
    body('fullName').notEmpty().withMessage('Full user name not empty'),
    body('email').notEmpty().withMessage('Email user not empty'),
    body('phone').notEmpty().withMessage('Phone user not empty'),
    body('payment').notEmpty().withMessage('Payment method not empty'),
    body('startDate').notEmpty().withMessage('Start date booking not empty'),
    body('endDate').notEmpty().withMessage('End date booking not empty'),
    body('roomNumbers').custom((val, {req}) => {
        if(!val.length) {
            throw Error('Room numbers not empty');
        }

        return true;
    })
],
MiddlewareBooking.findUserBooking,
MiddlewareBooking.findHotelRoomBooking,
ControllerBooking.userBookingRoom);

module.exports = router;