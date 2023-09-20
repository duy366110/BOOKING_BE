"use strict"
const ServiceLocation = require("../../services/service.location");
class ControllerLocation {

    constructor() { }

    // TRUY XUẤT DANH MỤC LOCATION
    async getLocationAll( req, res, next) {
        try {
            await ServiceLocation.getAll((information) => {
                let { status, message, locations, error } = information;
                if(status) {
                    res.status(200).json({status: true, message, locations});

                } else {
                    res.status(406).json({status: false, message, error});
                }
            });

        } catch (error) {
            // PHƯƠNG THỨC LỖI
            res.status(500).json({status: false, message: 'Internal server failed'});
        }
    }
}

module.exports = new ControllerLocation();