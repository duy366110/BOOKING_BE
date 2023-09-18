"use strict"
const ModelHotel = require("../model/model-hotel");
const ModelLocation = require("../model/model-location");
const ModelCategory = require("../model/model-category");
const UtilCloudinary = require("../util/util.cloudinary");

class ServiceCategory {

    constructor() { }

    // LẤY DANH SÁCH HOTEL
    async getLimit(limit, start, cb) {
        try {
            let hotels = await ModelHotel.find({}).limit(limit).skip(start).select(['name', 'city', 'type', 'rooms']).populate(['city', 'type']).lean();
            cb({status: true, message: 'Get hotels successfully', hotels});

        } catch (error) {
            // THỰC HIỆN PHƯƠNG THỨC LỖI
            cb({status: false, message: 'Method failed', error});
        }
    }

    // LẤY DANH SÁCH LOCATION
    async getAll(cb) {
        try {
            let categories = await ModelCategory.find({}).lean();
            cb({status: true, message: 'Get categories successfully', categories});

        } catch (error) {
            // THỰC HIỆN PHƯƠNG THỨC LỖI
            cb({status: false, message: 'Method failed', error});
        }
    }

    // LẤY DANH PHẦN TỬ THEO ID
    async getById(id, cb) {
        try {
            let hotel = await ModelHotel.findById(id).lean();
            cb({status: true, message: 'Get hotel successfully', hotel});

        } catch (error) {
            // THỰC HIỆN PHƯƠNG THỨC LỖI
            cb({status: false, message: 'Method failed', error});
        }
    }

    // LẤY SỐ LƯỢNG HOTEL
    async getAmount(cb) {
        try {
            let amount = await ModelHotel.find({}).count().lean();
            cb({status: true, message: 'Get amount hotel successfully', amount});

        } catch (error) {
            // THỰC HIỆN PHƯƠNG THỨC LỖI
            cb({status: false, message: 'Method failed', error});
        }
    }

    // TẠO MỚI HOTEL
    async create(hotel = {}, images, location, category, cb) {
        try {

            let hotelInfor = await ModelHotel.create({
                name: hotel.name, address: hotel.address,
                type: category, city: location,
                distance: hotel.distance, desc: hotel.desc,
                featured: hotel.featurefeature, images
            });

              if(hotelInfor) {
                    location.collections.push(hotelInfor);
                    category.collections.push(hotelInfor);

                    await location.save();
                    await category.save();
                    cb({status: true, message: 'Create hotel successfully'});
              }

        } catch (error) {
            // THỰC HIỆN PHƯƠNG THỨC LỖI
            cb({status: false, message: 'Method failed', error});
        }
    }

    // CẬP NHẬT HOTEL
    async update(hotel = {}, images = [], location, category, cb) {
        try {

            // THỰC HIỆN TÌM KIẾM VÀ CẬP NHẬT
            // 1) CẬP NHẬT CITY
            if(hotel.model.city._id.toString() !== location._id.toString()) {
                hotel.model.city.collections = hotel.model.city.collections.filter((city) => city.toString() !== hotel.model._id.toString());
                hotel.model.city.save();

                // CẬP NHẬT LIÊN KẾT MỚI
                location.collections.push(hotel.model);
                await location.save();

                // CẬP NHẬT LOCATION MỚI CHO HOTEL
                hotel.model.city = location;
            }

            // 2) CẬP NHẬT TYPE
            if(hotel.model.type._id.toString() !== category._id.toString()) {
                hotel.model.type.collections = hotel.model.type.collections.filter((type) => type.toString() !== hotel.model._id.toString());
                await hotel.model.type.save();

                // CẬP NHẬT LIÊN KẾT MỚI
                category.collections.push(hotel.model);
                await category.save();

                // CẬP NHẬT CATEGORY MỚI CHO HOTEL
                hotel.model.type = category;
            }

            // CẬP NHẬT HÌNH ẢNH
            if(images.length) {
                for(let image of images) {
                    hotel.model.images.push(image);
                }
            }

            // 3) CẬP NHẬT INFOR HOTEL
            hotel.model.name = hotel.name;
            hotel.model.address = hotel.address;
            hotel.model.distance = hotel.distance;
            hotel.model.desc = hotel.desc;
            hotel.model.feature = hotel.feature
            hotel.model.updateDate = new Date();

            await hotel.model.save();

            cb({status: true, message: 'Update hotel successfully'});

        } catch (error) {
            // THỰC HIỆN PHƯƠNG THỨC LỖI
            cb({status: false, message: 'Method failed', error});
        }
    }

    // XOÁ HOTEL
    async delete(hotel = {}, cb) {
        try {

            if(hotel.model.images.length) {
                let images = [];
                for(let image of hotel.model.images) {
                    let imageName = image.split('/').splice(-1).join('').split(".")[0];

                    // THUC HIEN KIEM TRA XEM FILE CO TON TAI TREN CLOUD
                    let {status, result } = await UtilCloudinary.exists(`booking/${imageName}`);
                    if(status) {
                        images.push(`booking/${imageName}`);
                    }
                }
                
                if(images.length) {
                    await UtilCloudinary.destroyMany(images);
                }
            }

            // XOÁ LIÊN KẾT GIỮA HOTEL VÀ LOCATION
            hotel.model.city.collections = hotel.model.city.collections.filter((city) => city.toString() !== hotel.model._id.toString());
            await hotel.model.city.save();

            // XOÁ LIÊN KẾT GIỮA HOTEL VÀ CATEGORY
            hotel.model.type.collections = hotel.model.type.collections.filter((type) => type.toString() !== hotel.model._id.toString());
            await hotel.model.type.save();

            // XOÁ HOTEL
            await hotel.model.deleteOne();
            cb({status: true, message: 'Update category successfully'});

        } catch (error) {
            // THỰC HIỆN PHƯƠNG THỨC LỖI
            cb({status: false, message: 'Method failed', error});
        }
    }


    // XOÁ ẢNH CATEGORY
    async deleteImage(category = {}, photo = '', cb) {
        try {

            // KIỂM TRA ẢNH CÓ TỒN TẠI THỰC HIỆN XOÁ
            if(category.model.images.length) {

                for(let image of category.model.images) {
                    if(image === photo) {
                        let imageName = image.split('/').splice(-1).join('').split(".")[0];

                        // THỰC HIỆN KIỂM TRA XEM FILE TỒN TẠI VÀ XOÁ FILE CLOUD
                        let {status, result } = await UtilCloudinary.exists(`booking/${imageName}`);
                        if(status) {
                            await UtilCloudinary.destroy(`booking/${imageName}`);
                            break;
                        }
                    }
                }
            }

            // THỰC HIỆN XOÁ FILE TRONG DB
             category.model.images =  category.model.images.filter((image) => image !== photo);
            await  category.model.save();

            cb({status: true, message: 'Delete photo image successfully'});

        } catch (error) {
            // THỰC HIỆN PHƯƠNG THỨC LỖI
            cb({status: false, message: 'Method failed', error});
        }
    }
}

module.exports = new ServiceCategory();


  