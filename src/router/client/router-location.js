const router = require('express').Router();
const ControllerLocation = require("../../controller/client/controller-location");

// ROUTER LẤY DANH SÁCH LOCATION CHO CLIENT
router.get("/", ControllerLocation.getLocation);

module.exports = router;