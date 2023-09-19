"use strict"
const { validationResult } = require("express-validator");
const ModelCategory = require("../../model/model-category");
const ServiceCategory = require("../../services/service.category");

class ControllerCategory {

    constructor() { }

    // LẤY DANH SÁCH CATEGORY
    getCategory = async (req, res, next) => {
        try {
            let { limit, start} = req.params;
            await ServiceCategory.getLimit(limit, start, (information) => {
                let { status, message, categories, error } = information;
                if(status) {
                    res.status(200).json({status: true, message, categories});

                } else {
                    res.status(406).json({status: false, message, error});
                }
            });

        } catch (error) {
            // PHƯƠNG THỨC LỖI
            res.status(500).json({status: false, message: 'Internal server failed'});
        }
    }

    // PHƯƠNG THỨC LẤY DANH SÁCH LOCATION
    getCategoryAll = async (req, res, next) => {
        try {
            await ServiceCategory.getAll((information) => {
                let { status, message, categories, error } = information;
                if(status) {
                    res.status(200).json({status: true, message, categories});

                } else {
                    res.status(406).json({status: false, message, error});
                }
            });

        } catch (error) {
            // PHƯƠNG THỨC LỖI
            res.status(500).json({status: false, message: 'Internal server failed'});
        }
    }

    // PHƯƠNG THỨC TÌM LOCATION THÔNG QUA ID
    getCategoryById = async(req, res, next) => {
        try {
            let { category } = req.params;
            await ServiceCategory.getById(category, (information) => {
                let { status, message, category, error } = information;
                if(status) {
                    res.status(200).json({status: true, message, category});

                } else {
                    res.status(406).json({status: false, message, error});
                }
            })

        } catch (error) {
            // PHƯƠNG THỨC LỖI
            res.status(500).json({status: false, message: 'Internal server failed'});;
        }
    }

    // LÂY SỐ LƯỢNG CATERY HIỆN CÓ
    getAmount = async (req, res, next) => {
        try {
            await ServiceCategory.getAmount((information) => {
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

    // ADMIN THÊM MỚI CATEGORY
    async createCategory(req, res, next) {
        let { errors } = validationResult(req);

        if(errors.length) {
            res.status(406).json({status: false, message: errors[0].msg});

        } else {
            try {
                let { files } =  req;
                let { title } = req.body;

                // LẤY THÔNG TIN DANH SÁCH HÌNH ẢNH CATEGORY
                let images = [];
                if(files.length) {
                    images = files.map((image) => {
                        return image.path? image.path : '';
                    })
                }

                // TẠO MỚI THÔNG TIN CATEGORY
                await ServiceCategory.create({title}, images, (information) => {
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

    // ADMIN TIẾN HÀNH CẬP NHẬT
    modifiCategory = async(req, res, next) => {
        let { errors } = validationResult(req);

        if(errors.length) {
            res.status(406).json({status: false, message: errors[0].msg});

        } else {
            try {
                let { category, title } = req.body;
                let { files } =  req;

                let categoryInfor = await ModelCategory.findById(category);

                // LẤY THÔNG TIN DANH SÁCH HÌNH ẢNH LOCATION.
                let images = [];
                if(files.length) {
                    images = files.map((image) => {
                        return image.path? image.path : '';
                    })
                }

                await ServiceCategory.update({model: categoryInfor, title}, images, (information) => {
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

    // ADMIN DELETE CATEGORY
    deleteCategory = async (req, res, next) => {
        let { errors } = validationResult(req);

        if(errors.length) {
            res.status(406).json({status: false, message: errors[0].msg});

        } else {
            try {
                let { category } = req.body;

                // THỰC HIỆN XOÁ CATEGORY THÔNG QUA ID
                let categoryInfor = await ModelCategory.findById(category);

                await ServiceCategory.delete({model: categoryInfor}, (information) => {
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

    // ADMIN XOÁ ẢNH CATEGORY
    deletePhoto = async (req, res, next) => {
        let { errors } = validationResult(req);

        if(errors.length) {
            res.status(406).json({status: false, message: errors[0].msg});

        } else {
            try {

                let { id, photo } = req.body;
                let categoryInfor = await ModelCategory.findById(id);

                await ServiceCategory.deleteImage({model: categoryInfor}, photo, (information) => {
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

module.exports = new ControllerCategory();