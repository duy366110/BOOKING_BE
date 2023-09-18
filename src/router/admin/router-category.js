const router = require("express").Router();
const { body } = require("express-validator");
const ModelCategory = require("../../model/model-category");
const ControllerCategory = require("../../controller/admin/controller-category");

// ROUTER PAGINATION LẤY THÔNG TIN DANH SÁCH CATEGORY
router.get("/:limit/:start", ControllerCategory.getCategory);

// ROUTER LẤY SỐ LƯỢNG LOCATION HIỆN CÓ
router.get("/amount", ControllerCategory.getAmount);

//ROUTER TÌN CATEGORY THEO ID
router.get("/:category", ControllerCategory.getCategoryById);

// ROUTER ADMIN LẤY DANH SÁCH CATEGORY
router.get("/", ControllerCategory.getCategoryAll);

// ROUTER THÊM MỚI CATEGORY
router.post("/",[
    body('title').custom( async(val, {req}) => {

        // KIỂM TRA TITLE KHÔNG ĐƯỢC TRỐNG
        if(!val.trim()) throw Error("Title not empty");

        // KIỂM TRA TITLE CÓ  ĐÃ ĐƯỢC SỬ DỤNG HAY CHƯA
        let categoryInfor = await ModelCategory.find({title: {$eq: val}});
        if(categoryInfor.length) {
            throw Error("category exists already");
        }

        return true;
    }),
], ControllerCategory.createCategory);

// ROUTER ADMIN THỰC HIỆN CẬP NHẬT CATEGORY
router.patch("/", [
    body('category').notEmpty().withMessage('ID category not empty'),
    body('title').custom( async(val, {req}) => {

        // KIỂM TRA TITLE KHÔNG ĐƯỢC TRỐNG
        if(!val.trim()) {
            throw Error("Title not empty");
        }

        // KIỂM TRA TITLE CÓ  ĐÃ ĐƯỢC SỬ DỤNG HAY CHƯA
        let categoryInfor = await ModelCategory.find({title: {$eq: val}});
        if(categoryInfor.length) {
            throw Error("category exists already");
        }

        return true;
    }),

], ControllerCategory.modifiCategory);

// ROUTER XOÁ CATEGORY
router.delete("/", [
    body("category").custom( async(val, { req }) => {
        if(!val.trim()) throw Error('Category ID not empty');

        // KIỂM TRA CATEGORY CÓ LIÊN ĐẾN HOTEL -  KHÔNG THỰC HIỆN CHỨC NĂNG
        let categoryInfor = await ModelCategory.findById(val);
        if(categoryInfor.collections.length) {
            throw Error('Category reference hotel not delete');
        }

        return true;
    })
], ControllerCategory.deleteCategory);

// ROUTER XOÁ ẢNH CATEGORY
router.delete('/photo', [
    body("id").notEmpty().withMessage("ID category not empty"),
    body("photo").notEmpty().withMessage("ID category not empty")
], ControllerCategory.deletePhoto);

module.exports = router;