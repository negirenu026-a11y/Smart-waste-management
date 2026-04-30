const User = require("../models/userModel");
const Area = require("../models/areaModel");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
require("dotenv").config();

const mcData = [
  { "name": "Aarav Sharma" },
  { "name": "Vivaan Singh" },
  { "name": "Aditya Verma" },
  { "name": "Vihaan Kapoor" },
  { "name": "Arjun Mehta" },
  { "name": "Sai Patel" },
  { "name": "Reyansh Gupta" },
  { "name": "Krishna Yadav" },
  { "name": "Ishaan Malhotra" },
  { "name": "Shaurya Joshi" },
  { "name": "Atharv Mishra" },
  { "name": "Dhruv Saxena" },
  { "name": "Kabir Bansal" },
  { "name": "Rudra Thakur" },
  { "name": "Yuvraj Chauhan" },
  { "name": "Ayaan Arora" },
  { "name": "Dev Agrawal" },
  { "name": "Parth Sood" },
  { "name": "Lakshya Rana" },
  { "name": "Harsh Vaid" },
  { "name": "Rohan Khanna" },
  { "name": "Mohit Saini" },
  { "name": "Nikhil Anand" },
  { "name": "Karan Oberoi" },
  { "name": "Rahul Nanda" },
  { "name": "Manav Tiwari" },
  { "name": "Tushar Grover" },
  { "name": "Siddharth Jain" },
  { "name": "Aniket Roy" },
  { "name": "Varun Desai" },
  { "name": "Priya Sharma" },
  { "name": "Ananya Singh" },
  { "name": "Diya Verma" },
  { "name": "Myra Kapoor" },
  { "name": "Aadhya Mehta" },
  { "name": "Sara Patel" },
  { "name": "Kiara Gupta" },
  { "name": "Navya Yadav" },
  { "name": "Pari Malhotra" },
  { "name": "Siya Joshi" },
  { "name": "Ira Mishra" },
  { "name": "Riya Saxena" },
  { "name": "Saanvi Bansal" },
  { "name": "Meher Thakur" },
  { "name": "Avni Chauhan" },
  { "name": "Ishita Arora" },
  { "name": "Pihu Agrawal" },
  { "name": "Kavya Sood" },
  { "name": "Khushi Rana" },
  { "name": "Sneha Vaid" },
  { "name": "Neha Khanna" },
  { "name": "Simran Saini" },
  { "name": "Naina Anand" },
  { "name": "Muskan Oberoi" },
  { "name": "Tanvi Nanda" },
  { "name": "Jiya Tiwari" },
  { "name": "Payal Grover" },
  { "name": "Shreya Jain" },
  { "name": "Ritika Roy" },
  { "name": "Vidhi Desai" },
  { "name": "Aman Dogra" },
  { "name": "Pankaj Negi" },
  { "name": "Deepak Rawat" },
  { "name": "Sunil Bhardwaj" },
  { "name": "Komal Rana" },
  { "name": "Rekha Thakur" },
  { "name": "Meena Chauhan" },
  { "name": "Geeta Sharma" },
  { "name": "Suresh Kumar" },
  { "name": "Rajesh Pathania" },
  { "name": "Pooja Jamwal" }
];

const seedMCs = async () => {
    try {
        const areas = await Area.find({ isDeleted: false });
        if (areas.length === 0) {
            console.log("❌ No areas found. Please add areas first.");
            return;
        }

        const hashedPassword = await bcrypt.hash("mc123456", 10);
        console.log(`🌱 Seeding ${mcData.length} MC users...`);

        for (let i = 0; i < mcData.length; i++) {
            const mc = mcData[i];
            const email = `${mc.name.toLowerCase().replace(/\s+/g, '')}${i}@mc.com`;
            
            // Assign to areas sequentially (loop back if more MCs than areas)
            const areaIndex = i % areas.length;
            const assignedArea = areas[areaIndex];

            // Check if MC already exists
            let user = await User.findOne({ email });
            if (!user) {
                user = new User({
                    name: mc.name,
                    email,
                    password: hashedPassword,
                    userType: "mc",
                    district: assignedArea.district,
                    city: assignedArea.city,
                    area: assignedArea.name,
                    zone: assignedArea.zone,
                    ward: assignedArea.ward,
                    state: "Himachal Pradesh"
                });
                await user.save();
                
                // Link Area to this MC
                assignedArea.mcId = user._id;
                await assignedArea.save();
                
                console.log(`✅ Created MC: ${mc.name} -> Assigned to Area: ${assignedArea.name}`);
            }
        }

        console.log("🏁 Bulk MC seeding completed.");
    } catch (err) {
        console.error("❌ MC Seed failed:", err.message);
    }
};

// Export for use in main seed file or standalone execution
module.exports = seedMCs;

// If run directly
if (require.main === module) {
    const connectDB = require("../config/db");
    connectDB().then(() => {
        seedMCs().then(() => mongoose.connection.close());
    });
}
