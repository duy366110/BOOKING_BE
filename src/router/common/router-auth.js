const router = require('express').Router();
const { body } = require('express-validator');
const ModelUser = require("../../model/model-user");
const ControllerAuth = require("../../controller/common/controller-auth");

// NGƯỜI DÙNG ĐĂNG NHẬP QUẢN TRỊ HỆ THỐNG
router.post('/signin/admin', [
    body('email').custom( async (val, {req}) => {
        if(!val.trim()) throw Error('E-mail not empty');
        
        let userInfor = await ModelUser.findOne({email: {$eq: val}}).populate('role');

        if(userInfor.role.name === 'Client') {
            throw Error('Account not permissing');
        }

        return true;
    }),
    body('password').notEmpty().withMessage('Password not empty')
    
], ControllerAuth.signinManager);

// NGƯỜI DÙNG ĐĂNG NHẬP CLIENT
router.post("/signin", [
    body('email').notEmpty().withMessage('E-mail not empty'),
    body('password').custom((val, { req }) => {
        if(!val.trim()) throw Error('Password not empty') ;
        if(val.trim().length <= 6) throw Error('Password at least 6 characters, up to 20 characters');
        return true;
    })
], ControllerAuth.signinClient);

module.exports = router;