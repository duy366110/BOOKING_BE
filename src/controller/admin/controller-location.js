"use strict"
const ModelLocation = require("../../model/model-location");
const { validationResult } = require("express-validator");
const ServiceLocation = require("../../services/service.location");

class ControllerLocation {
    constructor() { }

    // LẤY DANH SÁCH LOCATION
    getLocations = async (req, res, next) => {
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

    // PHƯƠNG THỨC LẤY DANH SÁCH LOCATION
    getLocationAll = async (req, res, next) => {
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

    // PHƯƠNG THỨC TÌM LOCATION THÔNG QUA ID
    getLocationById = async(req, res, next) => {
        try {
            let { location } = req.params;
            await ServiceLocation.getById(location, (information) => {
                let { status, message, location, error } = information;
                if(status) {
                    res.status(200).json({status: true, message, location});

                } else {
                    res.status(406).json({status: false, message, error});
                }
            })

        } catch (error) {
            // PHƯƠNG THỨC LỖI
            res.status(500).json({status: false, message: 'Internal server failed'});;
        }
    }

    // LÂY SỐ LƯỢNG LOCATION HIỆN CÓ
    getAmount = async (req, res, next) => {
        try {
            await ServiceLocation.getAmount((information) => {
                let { status, message, amount, error } = information;
                if(status) {
                    res.status(200).json({status: true, message, amount});

                } else {
                    res.status(406).json({status: false, message, error});
                }
            })

        } catch (error) {
            res.status(500).json({status: false, message: 'Internal server failed'});
        }
    }


    // ADMIN TẠO LOCATION
    createLocation = async (req, res, next) => {
        let { errors } = validationResult(req);

        if(errors.length) {
            res.status(406).json({status: false, message: errors[0].msg});

        } else {
            try {
                let { files } =  req;
                let { title } = req.body;

                // LẤY THÔNG TIN DANH SÁCH HÌNH ẢNH LOCATION.
                let images = [];
                if(files.length) {
                    images = files.map((image) => {
                        return image.path? image.path : '';
                    })
                }

                // TẠO MỚI THÔNG TIN LOCATION
                await ServiceLocation.create({title}, images, (information) => {
                    let { status, message, error } = information;
                    if(status) {
                        res.status(200).json({status: true, message});

                    } else {
                        res.status(406).json({status: false, message, error});
                    }
                })

            } catch (err) {
                // PHƯƠNG THỨC LỖI
                res.status(500).json({status: false, message: 'Internal server failed'});
            }
        }
    }

    // ADMIN TIẾN HÀNH CẬP NHẬT
    modifiLocation = async(req, res, next) => {
        let { errors } = validationResult(req);

        if(errors.length) {
            res.status(406).json({status: false, message: errors[0].msg});

        } else {
            try {
                let { location, title } = req.body;
                let { files } =  req;
                let locationInfor = await ModelLocation.findById(location);

                // LẤY THÔNG TIN DANH SÁCH HÌNH ẢNH LOCATION.
                let images = [];
                if(files.length) {
                    images = files.map((image) => {
                        return image.path? image.path : '';
                    })
                }

                await ServiceLocation.update({model: locationInfor, title}, images, (information) => {
                    let { status, message, error } = information;
                    if(status) {
                        res.status(200).json({status: true, message});

                    } else {
                        res.status(406).json({status: false, message, error});
                    }
                })


            } catch (error) {
                // PHƯƠNG THỨC LỖI
                res.status(500).json({status: false, message: 'Internal server failed'});
            }
        }
    }

    // ADMIN DELETE LOCATION
    deleteLocation = async (req, res, next) => {
        let { errors } = validationResult(req);

        if(errors.length) {
            res.status(406).json({status: false, message: errors[0].msg});

        } else {
            try {
                let { location } = req.body;
                
                // THỰC HIỆN XOÁ LOCATION THÔNG QUA ID
                let locationInfor = await ModelLocation.findById(location);
                await ServiceLocation.delete({model: locationInfor}, (information) => {
                    let { status, message, error } = information;
                    if(status) {
                        res.status(200).json({status: true, message});

                    } else {
                        res.status(406).json({status: false, message, error});
                    }
                })

            } catch (error) {
                // PHƯƠNG THỨC LỖI
                res.status(500).json({status: false, message: 'Internal server failed'});
            }
        }
    }

    // ADMIN XOÁ ẢNH LOCATION
    deletePhoto = async (req, res, next) => {
        let { errors } = validationResult(req);

        if(errors.length) {
            res.status(406).json({status: false, message: errors[0].msg});

        } else {
            try {

                let { id, photo } = req.body;
                let locationInfor = await ModelLocation.findById(id);

                await ServiceLocation.deleteImage({model: locationInfor}, photo, (information) => {
                    let { status, message, error } = information;
                    if(status) {
                        res.status(200).json({status: true, message});

                    } else {
                        res.status(406).json({status: false, message, error});
                    }
                })

            } catch (error) {
                // PHƯƠNG THỨC LỖI
                res.status(500).json({status: false, message: 'Internal server failed'});
            }
        }
    }

}

module.exports = new ControllerLocation();