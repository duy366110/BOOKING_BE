const router =require('express').Router();
const { body } = require('express-validator');
const ModelHotel = require("../../model/model-hotel");
const MiddlewareHotel = require("../../middleware/middleware-hotel");
const ControllerHotel = require("../../controller/admin/controller-hotel");

// ROUTER ADMIN LẤY THÔNG TIN TẤT CẢ HOTEL HIỆN CÓ
router.get('/', ControllerHotel.findHotels);

// ROUTER ADMIN LẤY THÔNG TIN HOTEL THÔNG QUA ID HOTEL
router.get('/:hotel', ControllerHotel.findHotelById);

// ROUTER ADMIN LẤY THÔNG TIN HOTEL THÔNG QUA ID THỰC HIỆN CẬP NHẬT
// router.get("/information/:hotel", ControllerHotel.findHotelEdit);

// ROUTER ADMIN TẠO MỚI THÔNG TIN HOTEL
router.post('/', [
    body('name').notEmpty().withMessage('Name not empty'),
    body('type').notEmpty().withMessage('Type not empty'),
    body('location').notEmpty().withMessage('Location not empty'),
    body('price').notEmpty().withMessage('Price not empty'),
    body('address').notEmpty().withMessage('Address not empty'),

],
MiddlewareHotel.hotelFindLocation,
MiddlewareHotel.hotelFindCategory,
ControllerHotel.creatHotel);

// ROUTER ADMIN SỬA HOTEL
router.patch('/', [
    body('hotel').notEmpty().withMessage('Hotel ID not empty'),
    body('name').notEmpty().withMessage('Name not empty'),
    body('type').notEmpty().withMessage('Type not empty'),
    body('location').notEmpty().withMessage('Location not empty'),
    body('price').notEmpty().withMessage('Price not empty'),
    body('address').notEmpty().withMessage('Address not empty'),
],
MiddlewareHotel.hotelFindById,
MiddlewareHotel.hotelFindLocation,
MiddlewareHotel.hotelFindCategory,
ControllerHotel.modifiHotel);

// ROUTER ADMIN XOÁ THÔNG TIN HOTEL
router.delete('/',[
    body('hotel').custom( async(val, { req}) => {
        if(!val.trim()) throw Error('Hotel ID not empty');

        let hotelInfor = await ModelHotel.findById(val);
        if(hotelInfor.rooms.length) {
            throw Error('Hotel reference to  rooms not executed method');
        }

        return true;
    }),
],
MiddlewareHotel.hotelFindById,
ControllerHotel.deleteHotel);

// ROUTER ADMIN XOÁ THÔNG TIN LIÊN KẾT GIỮA HOTEL VÀ ROOM
router.delete("/hotel-link-room", ControllerHotel.deleteRoomOfHotel);

// ROUTER ADMIN XOÁ ẢNH MÔ TẢ HOTEL
router.delete("/photo", ControllerHotel.deletePhoto);

module.exports = router;