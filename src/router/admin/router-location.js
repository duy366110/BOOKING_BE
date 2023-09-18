const router = require("express").Router();
const { body } = require("express-validator");
const ControllerLocation = require("../../controller/admin/controller-location");
const ModelLocation = require("../../model/model-location");

// ROUTER PAGINATION LẤY THÔNG TIN DANH SÁCH LOCATION
router.get("/:limit/:start", ControllerLocation.getLocations);

// ROUTER LẤY SỐ LƯỢNG LOCATION HIỆN CÓ
router.get("/amount", ControllerLocation.getAmount);

//ROUTER TÌN LOCATION THEO ID
router.get("/:location", ControllerLocation.getLocationById);

// ROUTER ADMIN LẤY DANH SÁCH LOCATION
router.get("/", ControllerLocation.getLocationAll);

// ROUTER TẠO MỚI LOCATION
router.post("/",[
    body('title').custom( async(val, {req}) => {

        // KIỂM TRA TITLE KHÔNG ĐƯỢC TRỐNG
        if(!val.trim()) throw Error("Title not empty");

        // KIỂM TRA TITLE CÓ  ĐÃ ĐƯỢC SỬ DỤNG HAY CHƯA
        let locationInfor = await ModelLocation.find({title: {$eq: val}});
        if(locationInfor.length) {
            throw Error("Location exists already");
        }

        return true;
    }),
], ControllerLocation.createLocation);

// ROUTER ADMIN THỰC HIỆN CẬP NHẬT LOCATION
router.patch("/", [
    body('location').notEmpty().withMessage('ID location not empty'),
    body('title').custom( async(val, {req}) => {

        // KIỂM TRA TITLE KHÔNG ĐƯỢC TRỐNG
        if(!val.trim()) {
            throw Error("Title not empty");
        }

        // KIỂM TRA TITLE CÓ  ĐÃ ĐƯỢC SỬ DỤNG HAY CHƯA
        let locationInfor = await ModelLocation.find({title: {$eq: val}});
        if(locationInfor.length) {
            throw Error("Location exists already");
        }

        return true;
    }),

], ControllerLocation.modifiLocation);

// ROUTER XOÁ LOCATION
router.delete("/", [
    body("location").custom( async(val, { req }) => {
        if(!val.trim()) throw Error('Location ID not empty');

        // KIỂM TRA LOCATION CÓ LIÊN ĐẾN HOTEL -  KHÔNG THỰC HIỆN CHỨC NĂNG
        let locationInfor = await ModelLocation.findById(val);
        if(locationInfor.collections.length) {
            throw Error('Location reference hotel not delete');
        }

        return true;
    })
], ControllerLocation.deleteLocation);

// ROUTER XOÁ ẢNH LOCATION
router.delete('/photo', [
    body("id").notEmpty().withMessage("ID location not empty"),
    body("photo").notEmpty().withMessage("ID location not empty")
], ControllerLocation.deletePhoto);

module.exports = router;