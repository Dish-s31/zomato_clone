const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const restaurantsSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    location_id: {
        type: Number,
        required: true
    },
    mealtype_id: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('restaurants', restaurantsSchema, 'restaurant');

// no data but connection to collection