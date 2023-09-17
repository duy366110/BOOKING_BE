const modelLocation = require("../../model/model-location");
const ModelLocation = require("../../model/model-location");
class ControllerLocation {

    constructor() { }

    // LẤY DANH SÁCH TẤT CẢU LOCATION
    getLocation = async( req, res, next) => {
        try {
            let locationInfor = await ModelLocation.find({});
            res.status(200).json({
                status: true,
                message: "Get location done",
                locations: locationInfor
            })

        } catch (error) {
            // PHƯƠNG THỨC LỖI
            res.status(500).json({status: false, message: 'Internal server failed', locations: locationInfor});
        }
    }
}

module.exports = new ControllerLocation();