const mongoose = require("mongoose");
const User = require("./models/userModel");
const Area = require("./models/areaModel");
const Complaint = require("./models/complaintModel");
const Task = require("./models/taskModel");
require("dotenv").config();

async function checkDB() {
    try {
        console.log("Connecting to:", process.env.MONGO_URL);
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to DB");
        
        const userCount = await User.countDocuments();
        const areaCount = await Area.countDocuments();
        const complaintCount = await Complaint.countDocuments();
        const taskCount = await Task.countDocuments();
        
        console.log(`Users: ${userCount}`);
        console.log(`Areas: ${areaCount}`);
        console.log(`Complaints: ${complaintCount}`);
        console.log(`Tasks: ${taskCount}`);
        
        if (userCount === 0 || areaCount === 0) {
            console.log("Database looks empty or incomplete. Seeding needed.");
        } else {
            console.log("Database has data.");
            const area = await Area.findOne();
            console.log("Sample Area:", JSON.stringify(area, null, 2));
        }
        
        await mongoose.connection.close();
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
}

checkDB();
