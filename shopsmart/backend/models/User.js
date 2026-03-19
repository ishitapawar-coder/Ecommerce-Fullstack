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
        type: String
    },
    googleId: {
        type: String,
        sparse: true
    },
    avatar: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    authToken: {
        type: String,
        default: null
    },
    tokenExpires: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });
userSchema.index({ authToken: 1 });

module.exports = mongoose.model('User', userSchema);