const mongodb = require('mongodb');
const { validationResult } = require('express-validator');
const ModelRole = require('../../model/model-role');
const ModelUser = require("../../model/model-user");
const Bcrypt = require("../../util/bcrypt");
const ObjectId = mongodb.ObjectId;

class ControllerUser {

    constructor() { }

    // LẤY VỀ SỐ LƯỢNG USER HIỆN CÓ
    getAmoutnUser = async(req, res, next) => {
        try {
            let amountUser = await ModelUser.find({}).count().exec();
            res.status(200).json({status: true, message: 'Get user amout', amount: amountUser});

        } catch (error) {
            res.status(500).json({status: false, message: 'Internal server failed'});
        }
    }

    // TRẢ VỀ THÔNG TIN USER VỚI SỐ LƯỢNG ĐƯỢC CHỈ ĐỊNH
    getLimitUser = async(req, res, next) => {
        try {
            let { limit, start } = req.params;
            let usersInfor = await ModelUser.find({}).limit(limit).skip(start).populate(['role']).lean();
            res.status(200).json({status: true, message: 'Find user successfully', users: usersInfor});

        } catch (error) {
            res.status(500).json({status: false, message: 'Internal server failed'});
        }
    }

    // LẤY VỀ THÔNG TIN TÀI KHOẢN
    findUsers = async (req, res, next) => {
        try {
            let usersInfor = await ModelUser.find({}).select(['username', 'fullname', 'email', 'phonenumber']);
            res.status(200).json({status: true, users: usersInfor});

        } catch (error) {
            res.status(500).json({status: false, message: 'Internal server failed'});

        }
    }

    // TIMG KIẾM USER THÔNG QUA ID
    findUserById = async (req, res, next) => {
        try {
            let { user } = req.params;
            let userInfor = await ModelUser.findById(user)
            .select(['username', 'fullname', 'email', 'phonenumber'])
            .populate('role');

            res.status(200).json({status: true, user: userInfor});;

        } catch (error) {
            res.status(500).json({status: false, message: 'Internal server failed'});

        }
    }

    // ADMIN TẠO MỚI TÀI KHOẢN
    createUser = async (req, res, next) => {
        const { errors } = validationResult(req);
        let {username, fullname, email, password, role, phonenumber} = req.body;

        try {
            if(errors.length) {
                res.status(406).json({status: false, message: 'E-mail account exists already'});
                
            } else {
                // THỰC HIÊNK TÌM KIẾM ROLE CỦA USER
                let roleInfor = await ModelRole.findById(role);

                // MÃ HOÁ MẬT KHẨU VÀ TẠO MỚI USER.
                let passwordBcrypt = Bcrypt.has(password);
                let userInfor = await ModelUser.create({
                    username,
                    fullname,
                    email,
                    password: passwordBcrypt,
                    phonenumber,
                    role: roleInfor
                })

                if(userInfor) {
                    // THỰC HIỆN TẠO LIÊN KẾT GIỮA USER VÀ ROLE
                    roleInfor.users.push(userInfor);
                    await roleInfor.save();
                    res.status(200).json({status: true, message: 'Create account successfully'});

                } else {
                    res.status(406).json({status: false, message: 'Create account failed'});

                }
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

                let userInfor = await ModelUser.findById(user).populate('role');
                let oldRole = userInfor.role;

                // CẬP THÔNG TIN CƠ SỞ CỦA USER
                userInfor.username = username;
                userInfor.fullname = fullname;
                userInfor.email = email;
                userInfor.phonenumber = phonenumber;

                // THỰC HIỆN CẬP NHẬT ROLE MỚI
                if((oldRole._id.toString() !== role)) {
                    let newRole = await ModelRole.findById(role);

                    // XOÁ LIÊN KẾT TRONG GIỮA USER VÀ ROLE CŨ
                    oldRole.users = oldRole.users.filter((elm) => elm._id.toString() !== userInfor._id.toString());

                    // CẬP NHẬT ROLE MỚI CHO USER
                    userInfor.role = newRole;
                    newRole.users.push(userInfor);

                    await oldRole.save();
                    await newRole.save();
                }

                // TIẾN HÀNH CẬP NHẬT THÔNG TIN USER
                await userInfor.save();

                // GỬI TRẢ TRẠNG THÁI VỀ NGƯỜI DÙNG
                res.status(200).json({status: true, message: 'Modifi user information'});

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

                // THỰC HIỆN XOÁ LIÊN KẾT GIỮA ROLE VÀ USER
                userInfor.role.users = userInfor.role.users.filter((elm) => elm.toString() !== user);
                await userInfor.role.save();


                // TIẾN HÀNH XOÁ USER
                await userInfor.deleteOne();
                
                // XOÁ USER THÀNH CÔNG
                res.status(200).json({status: true, message: 'Delete user successfully'});
    
            } catch (error) {
                // PHƯƠNG THỨC LỖI
                res.status(500).json({status: false, message: 'Internal server failed'});
            }
        }
    }
}

module.exports = new ControllerUser();