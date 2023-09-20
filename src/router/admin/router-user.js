const router = require('express').Router();
const ModelUser = require("../../model/model-user");
const { body } = require('express-validator');
const ControllerUser = require('../../controller/admin/controller-user');

// ROUTER LẤY VỀ SỐ LƯỢNG USER.
router.get("/amount", ControllerUser.getAmount);

// ROUTER TRẢ VỀ USER VỚI SỐ LƯỢNG ĐƯỢC CHỈ ĐỊNH
router.get("/:limit/:start", ControllerUser.getUsers);

// ROUTER TÌM USẺ THEO ID   
router.get("/:user", ControllerUser.getUserById);

// ROUTER ADMIN TÌM TẤT CẢ ACCOUNT HIỆN CÓ
router.get("/", ControllerUser.getUserAll);

// ROUTER ADMIN TẠO MỚI ACCOUNT USER.
router.post('/', [
    body('email').custom( async (val, {req}) => {
        if(!val.trim()) throw Error('Email can\'t empty');

        // KIỂM TRA E-MAIL ĐÃ ĐƯỢC SỬ DỤNG CHƯA
        let userInfor = await ModelUser.findOne({email: {$eq: val}});
        if(userInfor) throw Error('E-mail exists already');
        
        return true;
    })
], ControllerUser.createUser);

// ROUTER ADMIN SỬA THÔNG TIN TÀI KHOẢN
router.patch('/', [
    body('email').custom( async (val, { req }) => {
        if(!val.trim()) throw Error('Email can\'t empty');
        
        // KIỂM TRA E-MAIL ĐÃ ĐƯỢC SỬ DỤNG CHƯA
        let userInfor = await ModelUser.findOne({email: {$eq: val}});
        if(userInfor) throw Error('E-mail exists already');

        return true;
        
    })
], ControllerUser.modifiUser);

// ROUTER ADMIN XOÁ ACCOUNT
router.delete('/', [
    body("user").custom((val, {req}) => {
        if(!val.trim()) {
            throw Error('User ID can\'t empty');
        }
        
        return true;
    })
], ControllerUser.deleteUser);


module.exports = router;