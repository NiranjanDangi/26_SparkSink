const mongoose = require('mongoose');

const formDataSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    age: {
        type: Number,  // age as a number
        required: true,
    },
    contact: {
        type: String,  // contact as a string to accommodate different formats
        required: true,
    },
    address: {
        type: String,  // free-form text for address
        required: true,
    }
}, { timestamps: true });

const FormDataModel = mongoose.model('log_reg_form', formDataSchema);

module.exports = FormDataModel;