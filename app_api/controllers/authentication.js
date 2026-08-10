const mongoose = require('mongoose');
const User = mongoose.model("users", require('../models/users').schema);
const passport = require('passport');

const login = (req,res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ 'message': 'All fields are required.' });
    }
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.status(500).json(err);
        }
        if (user) {
            const token = user.generateJWT();
            return res.status(200).json({ token });
        }
        else {
            return res.status(401).json(info);
        }
    })(req, res);
};

const register = async (req, res) => {

    if (!req.body.email || !req.body.password || !req.body.name) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const user = new User({
        email: req.body.email,
        password: req.body.password,
        name: req.body.name
    });
    user.setPassword(req.body.password);
    const t = await user.save();
    if (!t) {
        return res.status(500).json(err);
    }
    else {
        const token = user.generateJWT();
        return res.status(200).json(token);
    }
}

module.exports = {
    register,
    login
}