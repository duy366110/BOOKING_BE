"use strict"
const { validationResult } = require('express-validator');
const ModelRole = require('../../model/model-role');
const ModelUser = require("../../model/model-user");
const ServiceUser = require("../../services/service.user");

class ControllerUser {

    constructor() { }

    // TRUY XUẤT THÔNG TIN USER VỚI SỐ LƯỢNG ĐƯỢC CHỈ ĐỊNH
    async getUsers(req, res, next) {
        try {
            let { limit, start} = req.params;
            await ServiceUser.getLimit(limit, start, (information) => {
                let { status, message, users, error } = information;
                if(status) {
                    res.status(200).json({status: true, message, users});

                } else {
                    res.status(406).json({status: false, message, error});
                }
            });

        } catch (error) {
            // PHƯƠNG THỨC LỖI
            res.status(500).json({status: false, message: 'Internal server failed'});

        }
    }

    // LẤY VỀ THÔNG TIN TÀI KHOẢN
    getUserAll = async (req, res, next) => {
        try {
            await ServiceUser.getAll((information) => {
                let { status, message, users, error } = information;
                if(status) {
                    res.status(200).json({status: true, message, users});

                } else {
                    res.status(406).json({status: false, message, error});
                }
            });

        } catch (error) {
            // PHƯƠNG THỨC LỖI
            res.status(500).json({status: false, message: 'Internal server failed'});
        }
    }

    // TRUY XUẤT USER THÔNG QUA ID
    getUserById = async (req, res, next) => {
        try {
            let { user } = req.params;
            await ServiceUser.getById(user, (information) => {
                let { status, message, user, error } = information;
                if(status) {
                    res.status(200).json({status: true, message, user});

                } else {
                    res.status(406).json({status: false, message, error});
                }
            })

        } catch (error) {
            // PHƯƠNG THỨC LỖI
            res.status(500).json({status: false, message: 'Internal server failed'});
        }
    }

    //TRUY XUẤT SỐ LƯỢNG USER HIỆN CÓ
    getAmount = async(req, res, next) => {
        try {
            await ServiceUser.getAmount((information) => {
                let { status, message, amount, error } = information;
                if(status) {
                    res.status(200).json({status: true, message, amount});

                } else {
                    res.status(406).json({status: false, message, error});
                }
            })

        } catch (error) {
            // PHƯƠNG THỨC LỖI
            res.status(500).json({status: false, message: 'Internal server failed'});
        }
    }

    // ADMIN TẠO MỚI TÀI KHOẢN
    createUser = async (req, res, next) => {
        const { errors } = validationResult(req);

        try {
            if(errors.length) {
                res.status(406).json({status: false, message: 'E-mail account exists already'});
                
            } else {
                let {username, fullname, email, password, role, phonenumber} = req.body;

                // THỰC HIÊNK TÌM KIẾM ROLE CỦA USER
                let roleInfor = await ModelRole.findById(role);

                // TẠO MỚI THÔNG TIN USER
                await ServiceUser.create({username, fullname, email, password, phonenumber}, roleInfor, (information) => {
                    let { status, message, error } = information;
                    if(status) {
                        res.status(200).json({status: true, message});

                    } else {
                        res.status(406).json({status: false, message, error});
                    }
                })
            }

        } catch (error) {
            res.status(500).json({status: false, message: 'Internal server failed'});

        }
    }

    // ADMIN SỬA THÔNG TIN TÀI KHOẢN
    modifiUser = async (req, res, next) => {
        let { user, username, fullname, email, phonenumber, role } = req.body;
        let { errors } = validationResult(req);

        if(errors.length) {
            res.status(406).json({status: false, message: errors[0].msg});

        } else {
            try {

                let userInfor = await ModelUser.findById(user).populate('role').exec();
                let roleInfor = await ModelRole.findById(role);

                await ServiceUser.update({model: userInfor, username, fullname, email, phonenumber}, roleInfor, (information) => {
                    let { status, message, error } = information;
                    if(status) {
                        res.status(200).json({status: true, message});

                    } else {
                        res.status(406).json({status: false, message, error});
                    }
                })

            } catch (error) {
                // PHUONG THỨC LỖI
                res.status(500).json({status: false, message: 'Internal server failed'});

            }
        }
    }

    //  ADMIN XOÁ TÀI KHOẢN
    deleteUser = async (req, res, next) => {
        let { errors } = validationResult(req);
        let { user } = req.body;                                                                                                

        if(errors.length) {
            res.status(406).json({staus: false, message: errors[0].msg});

        } else {
            try {

                let userInfor = await ModelUser.findById(user).populate('role').exec(); 
                
                await ServiceUser.delete({model: userInfor}, (information) => {
                    let { status, message, error } = information;
                    if(status) {
                        res.status(200).json({status: true, message});

                    } else {
                        res.status(406).json({status: false, message, error});
                    }
                })
    
            } catch (error) {
                // PHƯƠNG THỨC LỖI
                res.status(500).json({status: false, message: 'Internal server failed'});
            }
        }
    }
}

module.exports = new ControllerUser();