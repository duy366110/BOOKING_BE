const router = require('express').Router();
const ControllerCategory = require("../../controller/client/controller-category");

// ROUTER LẤY DANH SÁCH LOCATION CHO CLIENT
router.get("/", ControllerCategory.getCategory);

module.exports = router;