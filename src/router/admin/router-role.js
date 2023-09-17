const router = require('express').Router();
const mongodb = require("mongodb");
const { body }  = require('express-validator');
const ModelRole = require("../../model/model-role");
const ControllerRole = require("../../controller/admin/controller-role");
const ObjectId = mongodb.ObjectId;

// ROUTER ADMIN LẤY THÔNG TIN ROLE HIỆN CÓ
router.get("/amount", ControllerRole.getRoleAmount);

// ROUTER PAGINATION ADMIN LẤY THÔNG TIN TẤT CẢ CÁC ROLE
router.get('/:limit/:start', ControllerRole.getRoles);

// ROUTER ADMIN TÌM ROLE THEO ID
router.get("/:role", ControllerRole.findRoleById);

// ROUTER ADMIN LẤY THÔNG TIN TẤT CẢ CÁC ROLE
router.get('/', ControllerRole.findRoles);

// ROUTER ADMIN TẠO ROLE
router.post('/', [
    body('role').custom( async(val, {req}) => {

        // ROLE KHÔNG ĐƯỢC TRỐNG
        if(!val.trim()) {
            throw Error('Role not empty');
        }

        // KHÔNG ĐƯỢC TẠO HAI ROLE TRÙNG NHAU
        let roleInfor = await ModelRole.find({name: {$eq: val}}).exec();
        if(roleInfor.length > 0) {
            throw Error("Role already exists");
        }

        return true;
    })

], ControllerRole.createRole);

// ROUTER ADMIN SỬA ROLE
router.patch("/",[
    body('role').custom((val, { req}) => {
         // ROLE KHÔNG ĐƯỢC TRỐNG
         if(!val.trim()) {
            throw Error('Role not empty');
        }

        return true;
    }),
    body('name').custom( async(val, {req}) => {

        // NAME KHÔNG ĐƯỢC TRỐNG
        if(!val.trim()) {
            throw Error('Name not empty');
        }

        // KHÔNG ĐƯỢC TẠO HAI ROLE TRÙNG NHAU
        let roleInfor = await ModelRole.find({name: {$eq: val}}).exec();
        if(roleInfor.length) {
            throw Error("Name role already exists");
        }

        return true;
    })

], ControllerRole.modifiRole);

// ROUTER ADMIN XOA ROLE
router.delete('/', [
    body('role').custom( async(val, {req}) => {

        // ROLE KHÔNG ĐƯỢC TRỐNG
        if(!val.trim()) {
            throw Error('Role not empty');
        }

        // KHÔNG ĐƯỢC XOÁ ROLE KHI ROLE CÓ LIÊN KẾT TÀI KHOẢN
        let roleInfor = await ModelRole.findById(val).exec();
        if(roleInfor.users.length > 0) {
            throw Error("Role reference not delete");
        }

        return true;
    })

], ControllerRole.deleteRole);

module.exports = router;