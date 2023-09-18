const ModelHotel = require("../model/model-hotel");
const ModelLocation = require("../model/model-location");
const ModelCategory = require("../model/model-category");

class MiddlewareHotel {

    constrcutor() { }

    // HOTEL TÌM KIẾM MODEL HOTEL CẦN CẬP NHẬT
    hotelFindById = async(req, res, next) => {
        try {
            let { hotel } = req.body;
            let hotelInfor = await ModelHotel.findById(hotel).populate(["city", "type"]).exec();
            req.hotel = hotelInfor;
            next();

        } catch (error) {
            res.status(500).json({status: false, message: "Internal server failed"});
        }
    }

    // HOTEL TÌM LOCATION LIÊN KẾT
    hotelFindLocation = async (req, res, next) => {
        try {
            let { location } = req.body;
            let locationInfor = await ModelLocation.findById(location);
            req.location = locationInfor;
            next();

        } catch (error) {
            res.status(500).json({status: false, message: "Internal server failed"});
        }
    }

    // HOTEL TIM CATEGORY LIÊN KẾT
    hotelFindCategory = async (req, res, next) => {
        try {
            let { type } = req.body;
            let categoryInfor = await ModelCategory.findById(type);
            req.category = categoryInfor;
            next();

        } catch (error) {
            res.status(500).json({status: false, message: "Internal server failed"});
        }
    }

}

module.exports = new MiddlewareHotel();