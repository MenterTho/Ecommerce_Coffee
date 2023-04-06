const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = new Schema(
    {
        username: { type: String },
        password: { type: String },
        email: { type: String },
        image: { type: String, default: 'img/user.png' },
        access: { type: String },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('User', User);
