const router = require('express').Router();
const RouterRole = require("./router-role");
const RouterUser = require("./router-user");
const RouterLocation = require("./router-location");
const RouterCategory = require("./router-category");
const RouterHotel = require("./router-hotel");
const RouterRoom = require("./router-room");
const RouterBooking = require("./router-booking");

router.use("/booking", RouterBooking);
router.use("/role", RouterRole);
router.use("/user", RouterUser);
router.use("/location", RouterLocation);
router.use("/category", RouterCategory);
router.use("/hotel", RouterHotel);
router.use("/room", RouterRoom);

module.exports = router;