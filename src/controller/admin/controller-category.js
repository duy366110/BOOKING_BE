const ModelCategory = require("../../model/model-category");
const { validationResult } = require("express-validator");
const fs = require('fs');
const path = require("path");

class ControllerCategory {

    constructor() { }

    // LẤY DANH SÁCH CATEGORY
    getCategory = async (req, res, next) => {
        try {
            let { limit, start} = req.params;
            let categoryInfor = await ModelCategory.find({}).limit(limit).skip(start).exec();
            res.status(200).json({status: true, message: 'Get category successfull', categories: categoryInfor});

        } catch (error) {
            res.status(500).json({status: false, message: 'Internal server failed'});
        }
    }

    // LÂY SỐ LƯỢNG CATERY HIỆN CÓ
    getCategoryAmount = async (req, res, next) => {
        try {
            let amountCategory = await ModelCategory.find({}).count().exec();
            res.status(200).json({
                status: true,
                message: 'Amount category successfully',
                amount: amountCategory
            });

        } catch (error) {
            res.status(500).json({status: false, message: 'Internal server failed'});
        }
    }

    // PHƯƠNG THỨC TÌM LOCATION THÔNG QUA ID
    findCategoryById = async(req, res, next) => {
        try {
            let { category } = req.params;
            let categoryInfor = await ModelCategory.findById(category);
            res.status(200).json({status: true, message: 'Find location successfully', category: categoryInfor });

        } catch (error) {
            // PHƯƠNG THỨC LỖI
            res.status(500).json({status: false, message: 'Internal server failed',});;
        }
    }

    // PHƯƠNG THỨC LẤY DANH SÁCH CATEGORY
    findCategory = async (req, res, next) => {
        try {
            let categoriesInfor = await ModelCategory.find({});
            res.status(200).json({status: true, message: 'Find category successfully', categories: categoriesInfor});

        } catch (error) {
            res.status(500).json({status: false, message: 'Internal server failed'});
        }
    }

    // ADMIN THÊM MỚI CATEGORY
    createCategory = async(req, res, next) => {
        let { title } = req.body;
        let { files } =  req;
        let { errors } = validationResult(req);

        if(errors.length) {
            res.status(406).json({status: false, message: errors[0].msg});

        } else {
            try {

                // LẤY THÔNG TIN DANH SÁCH HÌNH ẢNH CATEGORY.
                let paths = [];
                if(files.length) {
                    paths = files.map((image) => {
                        return `images/${image.filename}`;
                    })
                }

                // TẠO MỚI THÔNG TIN CATEGORY
                let status = await ModelCategory.create({title, images: paths});

                // GỬI STATUS VỀ ADMIN
                if(status) {
                    res.status(200).json({status: true, message: 'Create location successfully'});

                } else {
                    res.status(406).json({status: false, message: 'Create location failed'});
                }

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

                // LẤY THÔNG TIN DANH SÁCH HÌNH ẢNH CATEGORY.
                let paths = [];
                if(files.length) {
                    paths = files.map((image) => {
                        return `images/${image.filename}`;
                    })

                    // THỰC HIỆN THÊM PHOTO VÀO CATEGORY
                    for(let path of paths) {
                        categoryInfor.images.push(path);
                    }
                }

                // THỰC HIỆN CẬP NHẬT THÔNG TIN VÀ GỬI TRẠNG THÁI VỀ ADMIN
                categoryInfor.title = title;
                await categoryInfor.save();
                res.status(200).json({status: true, message: "Update information category successfully"});


            } catch (error) {
                // PHƯƠNG THỨC LỖI
                res.status(500).json({status: false, message: 'Internal server failed'});
            }
        }
    }

    // ADMIN DELETE CATEGORY
    deleteCategory = async (req, res, next) => {
        let { category } = req.body;
        let { errors } = validationResult(req);

        if(errors.length) {
            res.status(406).json({status: false, message: errors[0].msg});

        } else {
            try {
                // THỰC HIỆN XOÁ CATEGORY THÔNG QUA ID
                let categoryInfor = await ModelCategory.findById(category);

                // THỰC HIỆN XOÁ ẢNH TRƯỚC KHI XOÁ MODEL
                if(categoryInfor.images.length) {
                    for(let image of categoryInfor.images) {
                        let fileExists = fs.existsSync(path.join(__dirname, "../../", "public", image));
                        if(fileExists) {
                            fs.unlinkSync(path.join(__dirname, "../../", "public", image));
                        }
                    }
                }

                // THỰC HIỆN XOÁ MODEL CATEGORY
                await categoryInfor.deleteOne();
                res.status(200).json({status: true, message: 'Delete category successfully'});                

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
    
                let photoPath = path.join(__dirname, "../../", "public", photo);
    
                // KIỂM TRA ẢNH CÓ TỒN TẠI THỰC HIỆN XOÁ
                let imageExists = fs.existsSync(photoPath);
                if(imageExists) {
                    fs.unlinkSync(photoPath);
                }
    
                // THỰC HIỆN XOÁ ẢNH TRONG MODEL
                categoryInfor.images = categoryInfor.images.filter((image) => image !== photo);
                await categoryInfor.save();
                res.status(200).json({status: true, messgae: 'Delete photo category successfully'});
    
    
            } catch (error) {
                // PHƯƠNG THỨC LỖI
                res.status(500).json({status: false, message: 'Internal server failed'});
            }
        }
    }

}

module.exports = new ControllerCategory();