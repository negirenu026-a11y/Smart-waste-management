const mongoose = require("mongoose");
const User = require("./backend/models/userModel");
const Area = require("./backend/models/areaModel");
const Complaint = require("./backend/models/complaintModel");
const Task = require("./backend/models/taskModel");
require("dotenv").config({ path: "./backend/.env" });

async function checkDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
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
            // Sample check for a document
            const area = await Area.findOne();
            console.log("Sample Area:", JSON.stringify(area, null, 2));
        }
        
        await mongoose.connection.close();
    } catch (err) {
        console.error("Error:", err);
    }
}

checkDB();
