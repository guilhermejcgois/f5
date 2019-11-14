const mongoose = require('mongoose');

const PlacesSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    number_points: {
        type: Number,
        required: true,
        default: 0
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    }
});

const Places = mongoose.model('Places', PlacesSchema);

module.exports = { Places, PlacesSchema };  