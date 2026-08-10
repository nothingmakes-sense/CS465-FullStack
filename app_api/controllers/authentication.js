const mongoose = require('mongoose');
const User = mongoose.model("users", require('../models/users').schema);

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
    register
}