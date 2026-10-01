require("dotenv").config();

const mongoose = require("mongoose");

const connectDB = require("./config/db");
const { seedAll } = require("./utils/seedData");

const run = async () => {

    try {

        await connectDB();

        const { created, skipped } = await seedAll();

        console.log(`Seeding done. Products created: ${created}, skipped (already existed): ${skipped}`);

        await mongoose.disconnect();

        process.exit(0);

    } catch (error) {

        console.error("Seeding failed:", error.message);

        process.exit(1);

    }

};

run();
