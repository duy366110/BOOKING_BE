"use strict"
const router = require('express').Router();
const ControllerCategory = require("../../controller/client/controller-category");

// ROUTER TRUY XUẤT DANH MỤC CATEGORY
router.get("/", ControllerCategory.getCategoryAll);

module.exports = router;