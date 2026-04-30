const mongoose = require("mongoose");
const User = require("./models/userModel");
require("dotenv").config();

async function listUsers() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        const users = await User.find({}, { password: 0 });
        console.log(JSON.stringify(users, null, 2));
        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
}

listUsers();
