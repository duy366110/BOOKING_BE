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