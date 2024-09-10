require('dotenv').config({ path: '../.env' });

console.log("ATLAS_DB:", process.env.ATLAS_DB);
const mongoose = require("mongoose");
const initData = require('./data.js');
const Listing = require("../models/listing.js");

const MONGO_URL = process.env.ATLAS_DB;

console.log("MONGO_URL:", MONGO_URL); // Debugging line

async function main() {
    if (!MONGO_URL) {
        console.error("MONGO_URL is not set. Check your .env file.");
        return;
    }

    await mongoose.connect(MONGO_URL);
}

main().then(() => {
    console.log("Connection Successful");
}).catch((err) => {
    console.log(err);
});

const initDB = async () => {
    try {
        await Listing.deleteMany({});
        initData.data = initData.data.map((obj) => ({ ...obj, owner: "66e04a69e1533c6335cbde19" }));
        await Listing.insertMany(initData.data);
        console.log("Data Initialized");
    } catch (error) {
        console.error("Error initializing database:", error);
    } finally {
        mongoose.connection.close(); // Close the connection
    }
};

initDB();
