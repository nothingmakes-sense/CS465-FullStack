//Travel Page

//var fs = require('fs');
//var trips = JSON.parse(fs.readFileSync('./data/trips.json', 'utf8'));

const tripsEndpoint = 'http://localhost:3000/api/trips';
const options = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
};

const travel = async function (req, res, next) {

    let message = null;

    var trips = await fetch(tripsEndpoint, options)
        .then((res) => res.json())
        .catch((err) => {
            console.log(err);
            return [];
        });
    res.render('travel', { title: 'Travel', trips: trips, message: '' });


    // await fetch(tripsEndpoint, options)
    //     .then((res) => res.json())
    //     .then((json) => {
    //         res.render('travel', { title: 'Travel', trips: json, message });
    //     }).catch((err) => {
    //         console.log(err);
    //         res.render('travel', { title: 'Travel', trips: [], message: 'Error fetching trips data' });
    //     });
};

module.exports = {
    travel
};