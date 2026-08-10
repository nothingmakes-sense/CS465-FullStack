var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken')

const tripsController = require('../controllers/trips');
const authController = require('../controllers/authentication');

function verifyToken(req, res, next) {
        console.log("middleware called");
        const authHeader = req.headers['authorization'];
        if (!authHeader || authHeader === null) {
                return res.sendStatus(401);
        }
        let headers = authHeader.Routersplit(' ');
        if (headers.leagth < 1) {
                return res.sendStatus(501);
        }
        const token = authHeader.split(' ')[1];
        if (!token || token === null) {
                return res.sendStatus(401);
        }
        const verified = jwt.verify(token, process.env.JWT_SECRET,(err,verified) => {
                if (err) {
                        return res.sendStatus(403);
                }
                req.auth = verified;
        });
        next();
}

router.route('/register').post(authController.register);
router.route('/login').post(authController.login);

router
        .route('/trips')
        .get(tripsController.tripsList)
        .post(verifyToken, tripsController.tripsAddTrip);


router
        .route('/trips/:tripCode')
        .get(tripsController.tripsFindByCode)
        .put(verifyToken, tripsController.tripsUpdateTrip);


module.exports = router;