"use strict"
const ModelRole = require("../model/model-role");

class ServiceRole {

    constructor() { }

    // LẤY DANH SÁCH ROLE
    async getLimit(limit, start, cb) {
        try {
            let roles = await ModelRole.find({}).sort({createDate: 'desc'}).limit(limit).skip(start).lean();
            cb({status: true, message: 'Get roles successfully', roles});

        } catch (error) {
            // THỰC HIỆN PHƯƠNG THỨC LỖI
            cb({status: false, message: 'Method failed', error});
        }
    }

    // LẤY DANH SÁCH ROLE
    async getAll(cb) {
        try {
            let roles = await ModelRole.find({}).lean();
            cb({status: true, message: 'Get roles successfully', roles});

        } catch (error) {
            // THỰC HIỆN PHƯƠNG THỨC LỖI
            cb({status: false, message: 'Method failed', error});
        }
    }

    // TRUY XUẤT ROLE TỬ THEO ID
    async getById(id, cb) {
        try {
            let role = await ModelRole.findById(id).lean();
            cb({status: true, message: 'Get role successfully', role});

        } catch (error) {
            // THỰC HIỆN PHƯƠNG THỨC LỖI
            cb({status: false, message: 'Method failed', error});
        }
    }

    // LẤY SỐ LƯỢNG ROLE
    async getAmount(cb) {
        try {
            let amount = await ModelRole.find({}).count().lean();
            cb({status: true, message: 'Get amount role successfully', amount});

        } catch (error) {
            // THỰC HIỆN PHƯƠNG THỨC LỖI
            cb({status: false, message: 'Method failed', error});
        }
    }

    // TẠO MỚI ROLE
    async create(role = {}, cb) {
        try {
            await ModelRole.create({name: role.name });
            cb({status: true, message: 'Create role successfully'});

        } catch (error) {
            // THỰC HIỆN PHƯƠNG THỨC LỖI
            cb({status: false, message: 'Method failed', error});
        }
    }

    // CẬP NHẬT ROLE
    async update(role = {}, cb) {
        try {
            role.model.name = role.name;

            await role.model.save();
            cb({status: true, message: 'Update role successfully'});


        } catch (error) {
            // THỰC HIỆN PHƯƠNG THỨC LỖI
            cb({status: false, message: 'Method failed', error});
        }
    }

    // XOÁ ROLE
    async delete(role = {}, cb) {
        try {
            await role.model.deleteOne();
            cb({status: true, message: 'Delete role account successfully'});

        } catch (error) {
            // THỰC HIỆN PHƯƠNG THỨC LỖI
            cb({status: false, message: 'Method failed', error});
        }
    }
}

module.exports = new ServiceRole();


  