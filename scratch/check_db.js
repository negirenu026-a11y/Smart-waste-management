const mongoose = require("mongoose");
const User = require("./backend/models/userModel");
const Complaint = require("./backend/models/complaintModel");
require("dotenv").config({ path: "./backend/.env" });

async function checkData() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to MongoDB");

        const users = await User.find({});
        console.log("\n--- USERS ---");
        users.forEach(u => {
            console.log(`ID: ${u._id}, Name: ${u.name}, Email: ${u.email}, Type: ${u.userType}, Deleted: ${u.isDeleted}`);
        });

        const complaints = await Complaint.find({});
        console.log("\n--- COMPLAINTS ---");
        complaints.forEach(c => {
            console.log(`ID: ${c._id}, Type: ${c.category || c.type}, Citizen: ${c.citizenName}, ID: ${c.citizenId}, Deleted: ${c.isDeleted}`);
        });

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkData();
