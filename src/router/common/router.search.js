const router = require("express").Router();
const ControllerSearch = require("../../controller/common/controller.search");

// CLIENT THỰC HIỆN TÌM KIẾM HOTEL - ROOM VỚI THÔNG TIN CHỈ ĐNHJ
router.post('/hotel', ControllerSearch.searchHotel);

module.exports = router;