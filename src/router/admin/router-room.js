const router = require('express').Router();
const { body } = require("express-validator");
const ModelRoom = require("../../model/model-room");
const MiddlewareRoom = require("../../middleware/middleware-room");
const ControllerRoom = require("../../controller/admin/controller-room");

// ROUTER TÌM THÔNG TIN THỰC HIỆN LIÊN KẾT GIỮA ROOM VÀ HOTEL
router.get("/link/:room", MiddlewareRoom.roomLinkFindById, MiddlewareRoom.hotelFindNotLinkRoom, ControllerRoom.findRoomInforLink);

// ROUTER PAGINATION LẤY THÔNG TIN DANH SÁCH LOCATION
router.get("/:limit/:start", ControllerRoom.getRooms);

// ROUTER LẤY SỐ LƯỢNG LOCATION HIỆN CÓ
router.get("/amount", ControllerRoom.getRoomAmount);

// ROUTER ADMIN LẤY THÔNG TIN TẤT CẢ CÁC ROOM
router.get("/", ControllerRoom.findRooms);


// ROUTER ADMIN TÌM ROOM THEO ID
router.get("/:room", ControllerRoom.findRoombyId);

// ADMIN TẠO MỚI ROOM CỦA HOTEL.
router.post('/',[
    body('title').notEmpty().withMessage("Title not empty"),
    body('price').notEmpty().withMessage("Price not empty"),
    body("maxPeople").notEmpty().withMessage("Max people not empty"),
    body("roomNumber").notEmpty().withMessage("Room number not empty"),
], ControllerRoom.createRoom);

// ROUTER CẬP NHẬT/ TẠO LIÊN KẾT GIỮA ROOM VÀ HOTEL
router.patch("/link", MiddlewareRoom.roomFindById, MiddlewareRoom.hotelFindById, ControllerRoom.createLinkRoomToHotel);

// ROUTER ADMIN CẬP NHẬT ROOM
router.patch("/",[
    body('room').notEmpty().withMessage("Room ID not empty"),
    body('title').notEmpty().withMessage("Title not empty"),
    body('price').notEmpty().withMessage("Price not empty"),
    body("maxPeople").notEmpty().withMessage("Max people not empty"),
    body("roomNumber").notEmpty().withMessage("Room number not empty"),
], MiddlewareRoom.roomFindByIdClearRoomNumber, ControllerRoom.modifiRoom);

// ROUTER ADMIN XOA ROOM
router.delete("/",[
    body('room').custom( async(val, {req}) => {
        if(!val.trim()) throw Error("Room ID not empty");

        let roomInfor = await ModelRoom.findById(val);
        if(roomInfor && roomInfor.hotels.length) {
            throw Error('Room reference hotel not executed method');
        }

        return true;
    })
], ControllerRoom.deleteRoom);

//  ROUTER ADMIN XOÁ ẢNH MÔ TẢ CỦA ROOM
router.delete("/photo", ControllerRoom.deletePhoto);

module.exports = router;