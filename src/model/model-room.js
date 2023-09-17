const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ModelRoom = new Schema({
    title: {
        type: String,
        default: ''
    },
    price: {
        type: mongoose.Schema.Types.Decimal128,
        default: 0
    },
    maxPeople:  {
        type: Number,
        default: 0
    },
    desc: {
        type: String,
        default: ''
    },
    roomNumbers: [
        {
            type: String,
            default: ''
        }
    ],
    images: [
        {
            type: String,
            default: ''
        }
    ],
    hotels: [
        {
            type: Schema.Types.ObjectId,
            ref: 'hotels'
        }
    ]
}, {
    collection: 'rooms'
})

module.exports = mongoose.model('rooms', ModelRoom);