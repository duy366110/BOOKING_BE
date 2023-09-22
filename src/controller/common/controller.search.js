"use strict"
const ModelLocation = require("../../model/model-location");
const ModelHotel = require("../../model/model-hotel");
const ModelRoom = require("../../model/model-room");
const { find } = require("../../model/model-role");
const ServiceHotel = require("../../services/service.hotel");
const ServiceSearch = require("../../services/service.search");


class ControllerSearch {

    constructor() { }

    // CLIENT TÌM KIẾM THÔNG TIN HOTEL - ROOM
    searchHotel = async(req, res, next) => {
        try {
            let { location, startDate, endDate, minPrice, maxPrice, audlt, children, room } = req.body;

            await ServiceSearch.searchHotelInformation(
                {location, startDate, endDate, minPrice, maxPrice, audlt, children, room } ,
                (information) => {
                    let { status, message, rooms, error} = information;
                    if(status) {
                        res.status(200).json({
                            status: true,
                            message,
                            metadata: {
                                rooms
                            }
                        });
    
                    } else {
                        res.status(406).json({status: false, message, error});
                    }
                })

        } catch (error) {
            res.status(500).json({ status: false, code: 500, message ,error})
        }
    }

}

module.exports = new ControllerSearch();