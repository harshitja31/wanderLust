require("dotenv").config({ path: "../.env" });
require("../config/env.js");

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const connectDB = require("../config/db.js");

const initDB = async () => {
    try {
        await connectDB();
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
