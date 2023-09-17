const router = require("express").Router();
const { body, check } = require("express-validator");
const ControllerUser = require("../../controller/client/controller-user");

router.post("/account", [
    body('email')
    .isEmail().withMessage('E-mail invalid')
    .notEmpty().withMessage('E-mail not empty'),

    check('password', 'Password has to be invalid')
    .isLength({ min: 6, max: 20 })
    .notEmpty().withMessage('Password not empty'),
], ControllerUser.registerAccount);

module.exports = router;