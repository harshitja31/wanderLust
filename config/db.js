const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const dbURL = process.env.ATLAS_DB;
        await mongoose.connect(dbURL);
        console.log("Database Connection Successful");
    } catch (err) {
        console.error("Database connection failed", err);
        process.exit(1);
    }
};

module.exports = connectDB;
