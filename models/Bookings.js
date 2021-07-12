const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Events'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('Bookings', bookingSchema);