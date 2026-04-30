const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Area = require("./models/areaModel");
require("dotenv").config();

const fix = async () => {
    try {
        await connectDB();
        const areas = await Area.find();
        console.log(`Found ${areas.length} areas.`);
        
        for (let area of areas) {
            if (!area.district) area.district = "Shimla";
            if (!area.pincode) area.pincode = "171001";
            await area.save();
            console.log(`Updated area: ${area.name}`);
        }
        
        process.exit(0);
    } catch (err) {
        console.error("Fix Error:", err.message);
        process.exit(1);
    }
};

fix();
