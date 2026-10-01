const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/snepdeal";

mongoose.connection.on("disconnected", () => {
    console.log("MongoDB disconnected");
});


const connectDB = async () => {
    await mongoose.connect(MONGO_URI, {
        serverSelectionTimeoutMS: 15000
    });

    console.log("MongoDB connected: " + mongoose.connection.name);
};

module.exports = connectDB;
