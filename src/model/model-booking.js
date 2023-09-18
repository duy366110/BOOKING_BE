const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ModelTransaction = new Schema({
    fullName: {
        type: String,
        default: ''
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    phone: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    },
    startDate: {
        type: Date,
        default: Date.now(),
    },
    endDate: {
        type: Date,
        default: Date.now(),
    },
    price: {
        type: mongoose.Schema.Types.Decimal128,
        default: 0
    },
    payment: {
        type: String,
        default: 'Credit Card'
    },
    status: {
        type: String,
        default: 'Booked'
    },
    hotel: {
        type: Schema.Types.ObjectId,
        ref: 'hotels'
    },
    room: {
        type: Schema.Types.ObjectId,
        ref: 'rooms'
    },
    createDate: {
        type: Date,
        default: Date.now
    },
    updateDate: {
        type: Date,
        default: Date.now
    },
    roomNumbers: [
        {
            type:String,
            default: ''
        }
    ]    
}, {
    collection: 'bookings'
})

module.exports = mongoose.model('bookings', ModelTransaction);