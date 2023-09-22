const router = require("express").Router();
const ControllerBooking = require("../../controller/admin/controller-booking");

// ROUTER PAGINATION LẤY THÔNG TIN DANH SÁCH BOOKING
router.get("/:limit/:start", ControllerBooking.getBooking);

// ROUTẺ LẤY SỐ LƯỢNG GIAO DỊCH BÔKING PHÂN TRANG
router.get("/amount", ControllerBooking.getAmount);

module.exports = router;