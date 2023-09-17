const mongodb = require('mongodb');
const ModelRole = require("../../model/model-role");
const { validationResult } = require('express-validator');
const ObjectId = mongodb.ObjectId;

class ControllerRole {

    constructor() { }

    // ADMIN LẤY SỐ LƯỢNG ROLE HIỆN CÓ TRONG DB
    getRoleAmount = async (req, res, next) => {
        try {
            let roleAmount = await ModelRole.find({}).count().exec();
            res.status(200).json({status: true, message: 'get role successfull', amount: roleAmount});

        } catch (error) {
            res.status(500).json({status: false, message: 'Internal server failed'});
        }
    }

    // ADMIN LẤY TẤT CẢ CÁC ROLE HIỆN CÓ
    getRoles = async (req, res, next) => {
        try {
            let { limit, start} = req.params;
            let rolesInfor = await ModelRole.find({}).limit(limit).skip(start).exec();
            res.status(200).json({status: true, roles: rolesInfor, message: 'Find roles successfully'});

        } catch (error) {
            res.status(500).json({status: false, message: 'Internal server failed'});

        }
    }

    // ADMIN LẤY TẤT CẢ CÁC ROLE HIỆN CÓ
    findRoles = async (req, res, next) => {
        try {
            let rolesInfor = await ModelRole.find({});
            res.status(200).json({status: true, roles: rolesInfor, message: 'Find roles successfully'});

        } catch (error) {
            res.status(500).json({status: false, message: 'Internal server failed'});

        }
    }

    // ADMIN LẤY ROLE THEO ID
    findRoleById = async (req, res, next) => {
        try {
            let { role } = req.params;

            if(role) {
                let roleInfor = await ModelRole.findById(role);
                res.status(200).json({status: true, role: roleInfor, message: 'Find role successfully'});

            } else {
                res.status(404).json({status: false, message: 'Missing role ID'});

            }

        } catch (error) {
            res.status(500).json({status: false, message: 'Internal server failed'});

        }
    }


    // ADMIN TẠO ROLE MỚI
    createRole = async (req, res, next) => {
        const { role } = req.body;
        const { errors } = validationResult(req);

        // XÁC THỰC LỖI THÔNG BÁO VỀ ADMIN
        if(errors.length) {
            res.status(400).json({staus: false, message: errors[0].msg});

        } else {
            try {

                // THÔNG TIN HỢP LỆ TẠO ROLE MỚI
                let roleInfor = await ModelRole.create({name: role});
                if(roleInfor) {
                    res.status(200).json({status: true, message: 'Create role successfully'});

                } else {
                    // TẠO ROLE KHÔNG THÀNH CÔNG
                    res.status(406).json({status: false, message: 'Create role failed'});

                }

            } catch (err) {
                // PHƯƠNG THỨC LỖI
                res.status(500).json({status: false, message: 'Internal server failed'});
            }

        }
    }

    // ADMIN SỬA THÔNG TIN ROLE
    modifiRole = async (req, res, next) => {
        let { role, name } = req.body;
        let { errors } = validationResult(req);

        try {

            if(errors.length) {
                res.status(400).json({staus: false, message: errors[0].msg});

            } else {
                let roleInfor = await ModelRole.findById(role);

                // NẾU ROLE CÓ LIÊN KẾT VỚI USER KHÔNG THỰC HIỆN CHỨC NĂNG
                if(!roleInfor.users.length) {
                    roleInfor.name = name;
                    let result = await roleInfor.save();
                    if(result) {
                        res.status(200).json({status: true, message: 'Modifi role successfully'});
                    }

                } else {
                     // CẬP NHẬT NAME ROLE KHÔNG THÀNH CÔNG
                    res.status(406).message({status: false, message: "Not modifi role reference to user account"});
                }
            
            }

        } catch (error) {
            // PHƯƠNG THỨC LỖI
            res.status(500).json({status: false, message: 'Internal server failed'});

        }
    }

    // ADMIN XOÁ ROLE
    deleteRole = async (req, res, next) => {
        let { role } = req.body;
        let { errors } = validationResult(req);

        if(errors.length) {
            res.status(400).json({staus: false, message: errors[0].msg});

        } else {
            try {
                // TIẾN HÀNH XOÁ ROLE
                let status = await ModelRole.deleteOne({_id: {$eq: new ObjectId(role)}});
                let { acknowledged, deletedCount } = status;

                if(deletedCount) {
                    // XOÁ ROLE THÀNH CÔNG
                    res.status(200).json({status: true, message: 'Delete role successfully'});

                } else {
                    // XOÁ ROLE KHÔNG THÀNH CÔNG
                    res.status(502).json({status: false, message: 'Delete role failed'});
                    
                }

            } catch (error) {
                // PHƯƠNG THỨC LỖI
                res.status(500).json({status: false, message: 'Internal server failed'});

            }
        }
    }
}

module.exports = new ControllerRole();