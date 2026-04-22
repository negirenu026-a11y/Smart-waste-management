const User = require("../models/userModel");
const Complaint = require("../models/complaintModel");
const Worker = require("../models/workerModel");
const Task = require("../models/taskModel");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const seedAdmin = async () => {
    try {
        const email = process.env.ADMIN_EMAIL || "negirenu026@gmail.com";
        const existing = await User.findOne({ email });
        if (!existing) {
            const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || "123456", 10);
            await new User({
                name: process.env.ADMIN_NAME || "RENU",
                email,
                password: hashedPassword,
                phone: process.env.ADMIN_PHONE || "9876543210",
                address: process.env.ADMIN_ADDRESS || "mohali",
                userType: "admin",
                city: "System",
                state: "Global"
            }).save();
            console.log("✅ Admin user created.");
        }
    } catch (err) {
        console.error("❌ Admin seed failed:", err.message);
    }
};

const seedSampleData = async () => {
    try {
        // ALWAYS clear and re-seed to ensure fresh state
        await Promise.all([
            User.deleteMany({ userType: { $ne: "admin" } }),
            Complaint.deleteMany({}),
            Worker.deleteMany({}),
            Task.deleteMany({})
        ]);
        console.log("🧹 Previous data cleared.");

        const hashedPassword = await bcrypt.hash("123456", 10);

        // ── 1. Create MC Users ────────────────────────────────────────────────
        const mcUsers = await User.insertMany([
            { name: "North Municipal Corp", email: "north_mc@wastewise.com", password: hashedPassword, userType: "mc", city: "North Delhi", state: "Delhi", phone: "9871000001" },
            { name: "South Municipal Corp", email: "south_mc@wastewise.com", password: hashedPassword, userType: "mc", city: "South Mumbai", state: "Maharashtra", phone: "9822000001" },
            { name: "East Municipal Corp", email: "east_mc@wastewise.com", password: hashedPassword, userType: "mc", city: "East Kolkata", state: "West Bengal", phone: "9833000001" }
        ]);

        // ── 2. Create Citizen Users ─────────────────────────────────────────────
        const citizens = await User.insertMany([
            { name: "Suresh Raina", email: "suresh@gmail.com", password: hashedPassword, userType: "citizen", city: "Delhi", state: "Delhi", phone: "9871111111" },
            { name: "Priya Singh", email: "priya@gmail.com", password: hashedPassword, userType: "citizen", city: "Mumbai", state: "Maharashtra", phone: "9822111111" }
        ]);

        // ── 3. Create Workers ──────────────────────────────────────────────────
        const workers = await Worker.insertMany([
            { name: "Rahul Sharma", contact: "9876543210", role: "Driver", schedule: "08:00 AM - 04:00 PM", area: "Rohini Sector 7", status: "Active", dutyStatus: "On Duty", workerPhoto: "https://i.pravatar.cc/150?u=rahul" },
            { name: "Anita Devi", contact: "9876543211", role: "Sweeper", schedule: "06:00 AM - 02:00 PM", area: "Bandra West", status: "Active", dutyStatus: "On Duty", workerPhoto: "https://i.pravatar.cc/150?u=anita" },
            { name: "Amit Kumar", contact: "9876543212", role: "Collector", schedule: "10:00 AM - 06:00 PM", area: "Salt Lake", status: "Active", dutyStatus: "On Duty", workerPhoto: "https://i.pravatar.cc/150?u=amit" }
        ]);

        // ── 4. Create Complaints ────────────────────────────────────────────────
        await Complaint.insertMany([
            { citizenId: citizens[0]._id, citizenName: citizens[0].name, type: "Waste Overflow", category: "Food Waste", area: "Park Avenue", city: "North Delhi", status: "Pending", priority: "High" },
            { citizenId: citizens[1]._id, citizenName: citizens[1].name, type: "Illegal Dumping", category: "Plastic / Dry Waste", area: "Metro Colony", city: "South Mumbai", status: "In Process", priority: "Medium" }
        ]);

        // ── 5. Create Tasks ─────────────────────────────────────────────────────
        await Task.insertMany([
            { title: "Clear Bin 42", assignedTo: "Rahul Sharma", deadline: "Today", status: "Pending", priority: "High" },
            { title: "Area Sweep - Bandra", assignedTo: "Anita Devi", deadline: "Tomorrow", status: "In Progress", priority: "Medium" }
        ]);

        console.log("✅ Sample data (Non-Kangra) seeded successfully.");
    } catch (err) {
        console.error("❌ Seed failed:", err.message);
    }
};

module.exports = async () => {
    await seedAdmin();
    await seedSampleData();
};