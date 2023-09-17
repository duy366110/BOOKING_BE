const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ModelLocation = new Schema({
    title: {
        type: String,
        default: ''
    },
    desc: {
        type: String,
        default: ''
    },
    images: [
        {
            type: String,
            default: ''
        }
    ],
    collections: [
        {
            type: Schema.Types.ObjectId,
            ref: 'hotels'
        }
    ]
}, {
    collection: 'locations'
})

module.exports = mongoose.model('locations', ModelLocation);