const router = require("express").Router();
const RouterUser = require("./router-user");
const RouterLocation = require("./router-location");
const RouterCategory =require("./router-category");
const RouterHotel = require("./router-hotel");
const RouterBooking = require("./router-booking");

router.use('/booking', RouterBooking);
router.use("/user", RouterUser);
router.use("/location", RouterLocation);
router.use("/category", RouterCategory);
router.use("/hotel", RouterHotel);

module.exports = router;