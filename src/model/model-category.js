const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ModelCategory = new Schema({
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
    createDate: {
        type: Date,
        default: Date.now
    },
    updateDate: {
        type: Date,
        default: Date.now
    },
    collections: [
        {
            type: Schema.Types.ObjectId,
            ref: 'hotels'
        }
    ]
}, {
    collection: 'categories'
})

module.exports = mongoose.model('categories', ModelCategory);