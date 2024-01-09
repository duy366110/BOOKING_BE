"use strict"
const ServiceLocation = require("../../services/service.location");
class ControllerLocation {

    constructor() { }

    // TRUY XUẤT AMOUNT LOCATION
    async getLocationAmount(req, res, next) {
        await ServiceLocation.getAmount((information) => {
            let { status, message, amount } = information;
            if(status) {
                return res.status(200).json({status, message, amount});
            }
            return res.status(400).json({status, message, amount: 0});
        })
    }

    // LẤY DANH SÁCH LOCATION
    async getLocations (req, res, next) {
        try {
            let { limit, start} = req.params;
            await ServiceLocation.getLimit(limit, start, (information) => {
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