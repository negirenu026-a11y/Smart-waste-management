const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "wastewise_secret_2024";

// Generate JWT token with role embedded
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            role: user.userType,
            name: user.name,
            email: user.email
        },
        JWT_SECRET,
        { expiresIn: "7d" }
    );
};

// POST /api/register
exports.registerUser = async (req, res) => {
    try {
        const { name, email, phone, password, userType, state, city } = req.body;

        // Prevent admin registration via API
        if (userType === "admin") {
            return res.status(403).json({ success: false, message: "Admin registration is not allowed." });
        }

        // Validate role
        if (!["citizen", "mc"].includes(userType)) {
            return res.status(400).json({ success: false, message: "Invalid user type. Must be citizen or mc." });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase(), isDeleted: false });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists with this email." });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = new User({
            name,
            email: email.toLowerCase().trim(),
            phone,
            password: hashedPassword,
            userType,
            state: state || "",
            city: city || ""
        });

        await newUser.save();

        const token = generateToken(newUser);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user: {
                id: newUser._id,
                fullName: newUser.name,
                email: newUser.email,
                role: newUser.userType,
                phone: newUser.phone,
                state: newUser.state,
                city: newUser.city
            }
        });
    } catch (err) {
        console.error("Register Error:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// POST /api/login
exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, message: "Username and password are required." });
        }

        // Find user by email or name (case-insensitive)
        const user = await User.findOne({
            $or: [
                { email: username.toLowerCase() },
                { name: { $regex: new RegExp(`^${username}$`, "i") } }
            ],
            isDeleted: false
        });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found. Please check your credentials." });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials. Wrong password." });
        }

        const token = generateToken(user);

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                fullName: user.name,
                email: user.email,
                role: user.userType,
                phone: user.phone,
                address: user.address,
                state: user.state,
                city: user.city
            }
        });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// GET /api/users — Admin only: list all non-deleted users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ isDeleted: false }, "-password").sort({ createdAt: -1 });
        res.status(200).json({ success: true, users });
    } catch (err) {
        console.error("GetAllUsers Error:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// DELETE /api/users/:id — Soft delete
exports.softDeleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isDeleted: true },
            { new: true }
        );
        if (!user) return res.status(404).json({ success: false, message: "User not found." });
        res.status(200).json({ success: true, message: "User deleted successfully." });
    } catch (err) {
        console.error("SoftDelete Error:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
