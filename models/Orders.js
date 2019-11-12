const mongoose = require('mongoose');

const bin = { type: mongoose.Schema.Types.ObjectId, ref: 'Bins' };
const organization = { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' };

const OrdersSchema = new mongoose.Schema({
    status: {
        type: String,
        enum: [
            'ORDER_OPENED',
            'ORDER_CONFIRMED',
            'ORDER_WAITING',
            'ORDER_DISPATCHED',
            'ORDER_FINISHED'
        ],
        default: 'ORDER_OPENED'
    },
    lastModifiedDate: {
        type: Date,
        default: Date.now
    },
    organization,
    bin
});

const Orders = mongoose.model('Orders', OrdersSchema);

module.exports = { Orders, OrdersSchema };
