const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: [
            'deepak_admin',
            'deepak_staff',
            'naveen_admin',
            'naveen_staff'
        ],
        required: true
    },
    fcmToken: {
        type: String,
        default: null,
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;