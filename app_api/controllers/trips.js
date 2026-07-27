const mongoose = require('mongoose');
const Trip = require('../models/travlr');
const Model = mongoose.model('trips', Trip.schema);

// GET /api/trips list all trips
const tripsList = async (req, res) => {
    try {
        const trips = await Model.find({}).lean();
        res.status(200).json(trips);
    } catch (err) {
        res.status(404).json({err});
    }
}

// GET /api/trips/:tripCode find trip by code
const tripsFindByCode = async (req, res) => {
    try {
        const trip = await Model.findOne({'code': req.params.tripCode}).lean();
        if (!trip) {
            return res.status(404).json({message: 'Trip not found'});
        }
        res.status(200).json(trip);
    } catch (err) {
        res.status(404).json({err});
    }
}

module.exports = {
    tripsList,
    tripsFindByCode
};