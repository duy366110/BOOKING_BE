"use strict"
const ModelUser = require("../model/model-user");
const UtilBcrypt = require("../util/util.bcrypt");

class ServiceUser {

    constructor() { }

    // LẤY DANH SÁCH USER
    async getLimit(limit, start, cb) {
        try {
            let users = await ModelUser.find({}).sort({createDate: 'desc'}).limit(limit).skip(start).populate(['role']).lean();
            cb({status: true, message: 'Get users successfully', users});

        } catch (error) {
            // THỰC HIỆN PHƯƠNG THỨC LỖI
            cb({status: false, message: 'Method failed', error});
        }
    }

    // LẤY DANH SÁCH USER
    async getAll(cb) {
        try {
            let users = await ModelUser.find({}).select(['username', 'fullname', 'email', 'phonenumber']).lean();
            cb({status: true, message: 'Get users successfully', users});

        } catch (error) {
            // THỰC HIỆN PHƯƠNG THỨC LỖI
            cb({status: false, message: 'Method failed', error});
        }
    }

    // TRUY XUẤT USER TỬ THEO ID
    async getById(id, cb) {
        try {
            let user = await ModelUser.findById(id).populate(['role']).lean();
            cb({status: true, message: 'Get user successfully', user});

        } catch (error) {
            // THỰC HIỆN PHƯƠNG THỨC LỖI
            cb({status: false, message: 'Method failed', error});
        }
    }

    // LẤY SỐ LƯỢNG USER
    async getAmount(cb) {
        try {
            let amount = await ModelUser.find({}).count().lean();
            cb({status: true, message: 'Get amount user successfully', amount});

        } catch (error) {
            // THỰC HIỆN PHƯƠNG THỨC LỖI
            cb({status: false, message: 'Method failed', error});
        }
    }

    // TẠO MỚI USER
    async create(user = {}, role = {}, cb) {
        try {
            let userInfor = await ModelUser.create({
                username: user.username,
                fullname: user.fullname,
                email: user.email,
                password: UtilBcrypt.has(user.password),
                phonenumber: user.phonenumber,
                role
            });

            if(userInfor) {
                role.users.push(userInfor);
                await role.save();
                cb({status: true, message: 'Create user successfully'});

            } else {
                cb({status: false, message: 'Create user unsuccessfully', error: null});
            }

        } catch (error) {
            // THỰC HIỆN PHƯƠNG THỨC LỖI
            cb({status: false, message: 'Method failed', error});
        }
    }

    // KHÁCH HÀNG ĐĂNG KÝ TÀI KHOẢN
    async register(user={}, role = {}, cb) {
        try {
            let userInfor = await ModelUser.create({
                username: user.username,
                fullname: user.fullname,
                email: user.email,
                password: UtilBcrypt.has(user.password),
                phonenumber: user.phone,
                role
            });

            if(userInfor) {
                role.users.push(userInfor);
                await role.save();
                cb({status: true, message: 'Register user successfully', user: userInfor});

            } else {
                cb({status: false, message: 'Register user unsuccessfully', user: null, error: null});
            }

        } catch (error) {
            // THỰC HIỆN PHƯƠNG THỨC LỖI
            cb({status: false, message: 'Method failed', error});
        }
    }

    // CẬP NHẬT USER
    async update(user = {}, role = {}, cb) {
        try {

            if(role._id.toString() !== user.model.role._id.toString()) {
                user.model.role.users = user.model.role.users.filter((userElm) => userElm.toString() !== user.model._id.toString());
                role.users.push(user.model);

                await user.model.role.save();
                await role.save();
            }

            user.model.username = user.username;
            user.model.fullname = user.fullname;
            user.model.email = user.email;
            user.model.phonenumber = user.phonenumber

            await user.model.save();
            cb({status: true, message: 'Update user successfully'});


        } catch (error) {
            // THỰC HIỆN PHƯƠNG THỨC LỖI
            cb({status: false, message: 'Method failed', error});
        }
    }

    // XOÁ CATEGORY
    async delete(user = {}, cb) {
        try {

            user.model.role.users = user.model.role.users.filter((userElm) => userElm.toString() !== user.model._id.toString());
            await user.model.role.save();

            await user.model.deleteOne();
            cb({status: true, message: 'Delete user account successfully'});

        } catch (error) {
            // THỰC HIỆN PHƯƠNG THỨC LỖI
            cb({status: false, message: 'Method failed', error});
        }
    }
}

module.exports = new ServiceUser();


  