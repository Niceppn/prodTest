const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    accountNumber: {
        type: String,
        required: true,
        unique: true
    }
});

module.exports = mongoose.model('BankAccount', accountSchema);