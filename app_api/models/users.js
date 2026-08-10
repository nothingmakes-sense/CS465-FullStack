const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    hash: String,
    salt: String,
});

userSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
}
userSchema.methods.validPassword = function (password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hash === hash;
}
userSchema.methods.generateJWT = function () {
    return jwt.sign({
        _id: this._id,
        username: this.username,
        name: this.name,
        email: this.email,
    }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

const User = mongoose.model('users', userSchema);
module.exports = User;