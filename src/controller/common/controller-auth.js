const ModelUser = require("../../model/model-user");
const { validationResult } = require('express-validator');
const jwt = require("../../util/util.jwt");
const bcrypt = require("../../util/util.bcrypt");
const ServiceUser = require("../../services/service.user");

class ControllerAuth {

    constructor() { }

    //  XÁC THỰC TÀI KHOẢN NGƯỜI DÙNG ĐĂNG NHẬP - QUẢN TRỊ
    signinManager = async (req, res, next) => {
        try {
            let { email, password } = req.body;
            let { errors } = validationResult(req);

            if(errors.length) {
                res.status(406).json({status: false, message: errors[0].msg});

            } else {

                let userInfor = await ModelUser.findOne({email: {$eq: email}}).populate('role').exec();
                bcrypt.compare(password, userInfor.password, (infor) => {
                    if(infor.status) {
                        jwt.sign({email: userInfor.email}, (infor) => {
                            if(infor.status) {
                                res.status(200).json({
                                    status: true,
                                    message: 'Signin successfully',
                                    infor: {
                                        token: infor.token,
                                        username: userInfor.username,
                                        fullname: userInfor.fullname,
                                        phone: userInfor.phonenumber,
                                        role: userInfor.role.name
                                    }
                                })

                            } else {

                            }
                        })

                    } else {
                        res.status(406).json({status: false,  message: 'Password incorrect'});
                    }

                })
            }

        } catch (error) {
            res.status(500).json({status: false, message: 'Internal server failed'});
        }
    }

    // XÁC THỰC TÀI KHOẢN TỪ PHÍA CLIENT
    signinClient = async (req, res, next) => {
        try {
            let { errors } = validationResult(req);

            if(errors.length) {
                res.status(406).json({status: false, message: errors[0].msg});

            } else {
                let { email, password } = req.body;
                await ServiceUser.findByEmail(email, (information) => {
                    let {status, message, user } = information;

                    if(status) {
                        bcrypt.compare(password, user.password, (infor) => {
                            if(infor.status) {
                                jwt.sign({email: user.email}, (infor) => {
                                    if(infor.status) {
                                        res.status(200).json({
                                            status: true,
                                            message: 'Signin successfully',
                                            infor: {
                                                token: infor.token,
                                                username: user.username,
                                                fullname: user.fullname,
                                                email: user.email,
                                                phone: user.phonenumber,
                                                role: user.role.name
                                            }
                                        })
        
                                    } else {
        
                                    }
                                })
        
                            } else {
                                res.status(406).json({status: false,  message: 'Password incorrect'});
                            }
                        })

                    } else {
                        res.status(404).json({status: false, message: 'Not found user account'});
                    }
                })
            }
        } catch (error) {
            res.status(500).json({status: true, message: 'Internal server failed'});

        }
    }
}

module.exports = new ControllerAuth();