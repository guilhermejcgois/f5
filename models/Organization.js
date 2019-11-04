const mongoose = require('mongoose');

const OrganizationSchema = new mongoose.Schema({
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
        required: true
    }
});

const Organization = mongoose.model('Organization', OrganizationSchema);

module.exports = { Organization, OrganizationSchema };  