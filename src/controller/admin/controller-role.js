const mongodb = require('mongodb');
const ModelRole = require("../../model/model-role");
const { validationResult } = require('express-validator');
const ObjectId = mongodb.ObjectId;

const ServiceRole = require("../../services/service.role");

class ControllerRole {

    constructor() { }

    // TRUY XUẤT THÔNG TIN ROLE VỚI SỐ LƯỢNG ĐƯỢC CHỈ ĐỊNH
    async getRoles(req, res, next) {
        try {
            let { limit, start} = req.params;
            await ServiceRole.getLimit(limit, start, (information) => {
                let { status, message, roles, error } = information;
                if(status) {
                    res.status(200).json({status: true, message, roles});

                } else {
                    res.status(406).json({status: false, message, error});
                }
            });

        } catch (error) {
            // PHƯƠNG THỨC LỖI
            res.status(500).json({status: false, message: 'Internal server failed'});

        }
    }

    // PHƯƠNG THỨC LẤY DANH SÁCH ROLE
    async getRoleAll(req, res, next) {
        try {
            await ServiceRole.getAll((information) => {
                let { status, message, roles, error } = information;
                if(status) {
                    res.status(200).json({status: true, message, roles});

                } else {
                    res.status(406).json({status: false, message, error});
                }
            });

        } catch (error) {
            // PHƯƠNG THỨC LỖI
            res.status(500).json({status: false, message: 'Internal server failed'});
        }
    }

    // TRUY XUẤT TÌM ROLE THÔNG QUA ID
    getRoleById = async(req, res, next) => {
        try {
            let { role } = req.params;
            await ServiceRole.getById(role, (information) => {
                let { status, message, role, error } = information;
                if(status) {
                    res.status(200).json({status: true, message, role});

                } else {
                    res.status(406).json({status: false, message, error});
                }
            })

        } catch (error) {
            // PHƯƠNG THỨC LỖI
            res.status(500).json({status: false, message: 'Internal server failed'});;
        }
    }


    // TRUY XUẤT SỐ LƯỢNG ROLE HIỆN CÓ
    getAmount = async (req, res, next) => {
        try {
            await ServiceRole.getAmount((information) => {
                let { status, message, amount, error } = information;
                if(status) {
                    res.status(200).json({status: true, message, amount});

                } else {
                    res.status(406).json({status: false, message, error});
                }
            })

        } catch (error) {
            res.status(500).json({status: false, message: 'Internal server failed'});
        }
    }

    // ADMIN TẠO ROLE MỚI
    createRole = async (req, res, next) => {
        const { errors } = validationResult(req);

        // XÁC THỰC LỖI THÔNG BÁO VỀ ADMIN
        if(errors.length) {
            res.status(400).json({staus: false, message: errors[0].msg});

        } else {
            try {
                const { role } = req.body;

                // TẠO MỚI THÔNG TIN ROLE
                await ServiceRole.create({name: role}, (information) => {
                    let { status, message, error } = information;
                    if(status) {
                        res.status(200).json({status: true, message});

                    } else {
                        res.status(406).json({status: false, message, error});
                    }
                })

            } catch (err) {
                // PHƯƠNG THỨC LỖI
                res.status(500).json({status: false, message: 'Internal server failed'});
            }

        }
    }

    // ADMIN SỬA THÔNG TIN ROLE
    modifiRole = async (req, res, next) => {
        let { errors } = validationResult(req);

        try {

            if(errors.length) {
                res.status(400).json({staus: false, message: errors[0].msg});

            } else {
                let { role, name } = req.body;
                let roleInfor = await ModelRole.findById(role);

                await ServiceRole.update({model: roleInfor, name}, (information) => {
                    let { status, message, error } = information;
                    if(status) {
                        res.status(200).json({status: true, message});

                    } else {
                        res.status(406).json({status: false, message, error});
                    }
                })
            
            }

        } catch (error) {
            // PHƯƠNG THỨC LỖI
            res.status(500).json({status: false, message: 'Internal server failed'});

        }
    }

    // ADMIN XOÁ ROLE
    deleteRole = async (req, res, next) => {
        let { errors } = validationResult(req);

        if(errors.length) {
            res.status(400).json({staus: false, message: errors[0].msg});

        } else {
            try {
                let { role } = req.body;
                let roleInfor = await ModelRole.findById(role);

                await ServiceRole.delete({model: roleInfor}, (information) => {
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

module.exports = new ControllerRole();