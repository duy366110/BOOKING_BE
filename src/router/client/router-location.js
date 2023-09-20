"use strict"
const router = require('express').Router();
const ControllerLocation = require("../../controller/client/controller-location");

// ROUTER TRUY XUẤT DANH MỤC LOCATION
router.get("/", ControllerLocation.getLocationAll);

module.exports = router;