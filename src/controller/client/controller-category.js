"use strict"
const ServiceCategory = require("../../services/service.category");

class ControllerCategory {

    constructor() { }

    // TRUY XUẤT DANH MỤC CATEGORY
    async getCategoryAll( req, res, next) {
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
}

module.exports = new ControllerCategory();