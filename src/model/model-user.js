const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ModelUser = new Schema({
    username: {
        type: String,
        default: '',
    },
    fullname: {
        type: String,
        default: '',
    }, 
    email: {
        type: String,
        default: '',
    },
    password: {
        type: String,
        default: ''
    },
    phonenumber: {
        type: String,
        default: '',
    },
    role: {
        type: Schema.Types.ObjectId,
        ref: 'roles'
    },
    createDate: {
        type: Date,
        default: Date.now
    },
    updateDate: {
        type: Date,
        default: Date.now
    },
    bookings: [
        {
            type: Schema.Types.ObjectId,
            ref: 'bookings'
        }
    ]
}, {
    collection: 'users'
})

module.exports = mongoose.model('users', ModelUser);