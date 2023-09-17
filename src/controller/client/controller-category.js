const ModelCategory = require("../../model/model-category");

class ControllerCategory {

    constructor() { }

    // LẤY DANH SÁCH TẤT CẢU LOCATION
    getCategory = async( req, res, next) => {
        try {
            let categoryInfor = await ModelCategory.find({});
            res.status(200).json({
                status: true,
                message: "Get location done",
                categories: categoryInfor
            })

        } catch (error) {
            // PHƯƠNG THỨC LỖI
            res.status(500).json({status: false, message: 'Internal server failed'});
        }
    }
}

module.exports = new ControllerCategory();