const router = require("express").Router();
const ModelUser = require("../../model/model-user");
const { body, check } = require("express-validator");
const ControllerUser = require("../../controller/client/controller-user");

router.post("/account", [
    body('username').notEmpty().withMessage('User name not empty'),
    body('fullname').notEmpty().withMessage('Full name not empty'),
    body('email').custom( async (val, {req}) => {
        if(!val.trim()) throw Error('Email can\'t empty');

        // KIỂM TRA E-MAIL ĐÃ ĐƯỢC SỬ DỤNG CHƯA
        let userInfor = await ModelUser.findOne({email: {$eq: val}});
        if(userInfor) throw Error('E-mail exists already');
        
        return true;
    }),
    body('password').notEmpty().withMessage('Password not empty'),
    body('phone').notEmpty().withMessage('Phone number not empty'),
], ControllerUser.registerAccount);

module.exports = router;