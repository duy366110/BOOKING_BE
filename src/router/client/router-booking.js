const router = require('express').Router();
const { body } = require("express-validator");
const MiddlewareUser = require("../../middleware/client/middleware-user");
const MiddlewareBooking = require("../../middleware/middleware-booking");
const MiddlewareAuthorization = require("../../middleware/middleware.authorization");
const ControllerBooking = require("../../controller/client/controller-booking");

//ROUTER THỰC HIỆN LẤY THÔNG TRANSACTION BOOKING TRẢ VỀ PHÍA CLIENT
router.get("/transaction",
    MiddlewareAuthorization.verifyToken,
    ControllerBooking.userFindHistoryTransactionBooking);

// ROUTER KHÁCH HÀNG THỰC HIỆN BOOKING HOTEL - ROOM
router.post("/room", [
    body('hotel').notEmpty().withMessage('Hotel ID not empty'),
    body('room').notEmpty().withMessage('Room ID not empty'),
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
MiddlewareAuthorization.verifyToken,
MiddlewareBooking.findInformationHotelAndRoomBeforeBooking,
ControllerBooking.booking);

module.exports = router;