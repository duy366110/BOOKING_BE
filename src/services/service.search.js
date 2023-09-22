"use strict"
const ModelHotel = require("../model/model-hotel");
const ModelLocation = require("../model/model-location");

class ServiceSearch {

    constructor() { }

    // TRUY XUẤT THÔNG TIN HOTEL VÀ ROOM THEO THÔNG TIN SEẢCH CỦA KHÁCH HÀNG
    async searchHotelInformation(information = {}, cb) {
        try {
            let quantityPeople = information.audlt? information.audlt : 0 + information.children? information.children : 0;

            let locations = await ModelLocation
                .findOne({title:  { $regex: `.*${information.location}.*`}})
                .populate([{
                    path: 'collections',
                    populate: [
                        {
                            path: 'rooms',
                            match: {
                                price: {
                                    $gte: information.minPrice? Number(information.minPrice) : 0,
                                    $lte: information.maxPrice? Number(information.maxPrice) : 10000
                                },
                                maxPeople: { $gte: Number(quantityPeople) },
                            }
                        }
                    ]
                }])
                .lean();

            let rooms = locations? locations.collections[0].rooms : [];
            cb({status: true, message: 'Get search room hotel successfully', rooms});

        } catch (error) {
            // THỰC HIỆN PHƯƠNG THỨC LỖI
            cb({status: false, message: 'Method failed', error});
        }
    }

}

module.exports = new ServiceSearch();