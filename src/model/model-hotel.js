const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ModelHotel = new Schema({
    name: {
        type: String,
        default: '',
    },
    city: {
        type: Schema.Types.ObjectId,
        ref: 'locations'
    },
    type: {
        type: Schema.Types.ObjectId,
        ref: 'categories'
    },
    address: {
        type: String,
        default: ''
    },
    distance: {
        type: String,
        default: ''
    },
    images:[
        {
            type: String,
            default: ''
        }
    ],
    desc: {
        type: String,
        default: ''
    },
    rating: {
        type: Number,
        default: 0
    },
    featured: {
        type: Boolean,
        default: false
    },
    createDate: {
        type: Date,
        default: Date.now
    },
    updateDate: {
        type: Date,
        default: Date.now
    },
    rooms: [
        {
            type: Schema.Types.ObjectId,
            ref: 'rooms'
        }
    ]
}, {
    collection: 'hotels'
})

module.exports = mongoose.model('hotels', ModelHotel);