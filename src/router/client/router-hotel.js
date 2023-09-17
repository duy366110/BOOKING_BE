const router = require("express").Router();
const ControllerHotel = require("../../controller/client/controller-hotel");
// ROUTER TÌM ROOM THUỘC HOTEL
router.get("/:hotel/:room", ControllerHotel.getRoomHotelByID);

// ROUTER TÌM HOTEL THEO ID CHỈ ĐỊNH
router.get("/:hotel", ControllerHotel.getHotelById);

// ROUTER TÌM DANH SÁCH HOTEL FULL
router.get("/", ControllerHotel.getHotel);

module.exports = router;