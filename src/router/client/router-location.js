"use strict"
const router = require('express').Router();
const ControllerLocation = require("../../controller/client/controller-location");

// ROUTER TRUY XUẤT DANH MỤC LOCATION
router.get("/amount", ControllerLocation.getLocationAmount);

// ROUTER PAGINATION LẤY THÔNG TIN DANH SÁCH LOCATION
router.get("/:limit/:start", ControllerLocation.getLocations);

// ROUTER TRUY XUAT ALL LOCATION
router.get("/", ControllerLocation.getLocationAll);

module.exports = router;