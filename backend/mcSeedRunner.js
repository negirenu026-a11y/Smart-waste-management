const mongoose = require("mongoose");
const connectDB = require("./config/db");
const seedMCs = require("./seeder/mcSeeder");
require("dotenv").config();

const run = async () => {
    try {
        await connectDB();
        await seedMCs();
        console.log("MC Seeding complete.");
        process.exit(0);
    } catch (err) {
        console.error("Runner Error:", err.message);
        process.exit(1);
    }
};

run();
