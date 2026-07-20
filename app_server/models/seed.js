// Seed script to populate the Trips collection with sample data
// 
// Usage examples:
//   node app_api/models/seed.js
//   DB_HOST=127.0.0.1 node app_api/models/seed.js
//   MONGODB_URI=mongodb://localhost:27017/travlr node app_api/models/seed.js
//
// If MongoDB is in Docker, make sure you published the port:
//   docker run -d --name travlr-mongo -p 27017:27017 mongo:latest

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Prefer a full URI if provided, otherwise build one
const dbURI = process.env.MONGODB_URI ||
              process.env.DB_URI ||
              `mongodb://${process.env.DB_HOST || '127.0.0.1'}:27017/travlr`;

// Import the Trip model (registers the schema)
const Trip = require('./travlr');

async function seedDatabase() {
    console.log('Attempting to connect to:', dbURI);
    try {
        // Connect with a short timeout so failures are obvious
        await mongoose.connect(dbURI, {
            serverSelectionTimeoutMS: 5000   // fail fast
        });
        console.log('Mongoose connected successfully');

        // Read the trips.json file
        const tripsFilePath = path.join(__dirname, '../../data/trips.json');
        console.log('Reading seed data from:', tripsFilePath);

        if (!fs.existsSync(tripsFilePath)) {
            throw new Error(`trips.json not found at ${tripsFilePath}`);
        }

        const tripsData = JSON.parse(fs.readFileSync(tripsFilePath, 'utf8'));
        console.log(`Found ${tripsData.length} trips in JSON file`);

        // Clear existing trips collection
        const deleteResult = await Trip.deleteMany({});
        console.log(`Cleared ${deleteResult.deletedCount} existing documents`);

        // Insert the sample data
        const result = await Trip.insertMany(tripsData);
        console.log(`Successfully seeded ${result.length} trips`);

        // Verify by retrieving
        const trips = await Trip.find({}).lean();
        console.log('\n--- Retrieved Trips from Database ---');
        console.log(JSON.stringify(trips, null, 2));

    } catch (err) {
        console.error('\n✗ Error seeding database:');
        console.error(err.message);

        if (err.name === 'MongooseServerSelectionError' || err.message.includes('ECONNREFUSED')) {
            console.error('\n--- Common Docker fixes ---');
            console.error('1. Make sure the container is running and the port is published:');
            console.error('     docker run -d --name travlr-mongo -p 27017:27017 mongo:latest');
            console.error('2. Check the container is healthy:');
            console.error('     docker ps');
            console.error('     docker logs travlr-mongo');
            console.error('3. Try an explicit connection string:');
            console.error('     MONGODB_URI=mongodb://127.0.0.1:27017/travlr node app_api/models/seed.js');
            console.error('4. If you started Mongo with authentication, include credentials in the URI.');
        }
    } finally {
        await mongoose.connection.close().catch(() => {});
        console.log('Mongoose connection closed.');
        process.exit(0);
    }
}

seedDatabase();