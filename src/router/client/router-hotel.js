"use strict"
const router = require("express").Router();
const ControllerHotel = require("../../controller/client/controller-hotel");

// ROUTER TRUY XUẤT DANH MỤC HOTEL THEO ID
router.get("/:hotel", ControllerHotel.getHotelById);

// ROUTER TÌM ROOM THUỘC HOTEL
router.get("/:hotel/:room", ControllerHotel.getRoomHotelByID);

// ROUTER TRUY XUẤT DANH MỤC HOTEL
router.get("/", ControllerHotel.getHotel);

module.exports = router;