const mongoose = require('mongoose');

const bins = [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Bin' }
];

const OrganizationSchema = new mongoose.Schema({
    logo: {
        data: Buffer,
        type: String
    },
    address: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    cnpj: {
        type: String,
        required: true
    },
    tel: {
        type: String,
        required: false
    },
    payed: {
        type: Boolean,
        required: true,
        default: false
    },
    payment_info: {
        type: {
            name: {
                type: String,
                required: true
            },
            number: {
                type: String,
                required: true
            },
            validity: {
                type: String,
                required: true
            },
            cvv: {
                type: String,
                required: true
            }
        },
    },
    bins
});

const Organization = mongoose.model('Organization', OrganizationSchema);

module.exports = { Organization, OrganizationSchema };  