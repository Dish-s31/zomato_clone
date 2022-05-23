const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const locationSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('location', locationSchema, 'locations');

// no data but connection to collection