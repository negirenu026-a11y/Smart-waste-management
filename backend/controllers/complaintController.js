const Complaint = require("../models/complaintModel");
const User = require("../models/userModel");
const Area = require("../models/areaModel");
const path = require("path");

// POST /api/complaints — Create a new complaint
exports.createComplaint = async (req, res) => {
    try {
        const { type, category, description, district, city, area, location, ward, zone } = req.body;

        // Find the area to get assigned MC
        const areaDoc = await Area.findOne({ district, city, name: area, isDeleted: false });
        
        if (!areaDoc || !areaDoc.mcId) {
            return res.status(400).json({ 
                success: false, 
                message: "No Municipal Corporation (MC) assigned to this area. Complaint cannot be filed." 
            });
        }

        const citizenId = req.user?.id;
        const citizenName = req.user?.name || "";
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

        const newComplaint = new Complaint({
            citizenId,
            citizenName,
            type: type || category || "Other",
            category: category || type || "Other",
            description,
            state: "Himachal Pradesh",
            district,
            city,
            area,
            location,
            ward,
            zone,
            assignedMcId: areaDoc.mcId,
            imageUrl
        });

        await newComplaint.save();

        res.status(201).json({
            success: true,
            message: "Complaint filed and assigned to MC successfully.",
            complaint: newComplaint
        });
    } catch (err) {
        console.error("CreateComplaint Error:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// GET /api/complaints — Get all active complaints
exports.getAllComplaints = async (req, res) => {
    try {
        const filter = { isDeleted: false };

        // Citizens can only see their own complaints
        if (req.user?.role === "citizen") {
            filter.citizenId = req.user.id;
        }

        // MCs can only see complaints assigned to them
        if (req.user?.role === "mc") {
            filter.assignedMcId = req.user.id;
        }

        const complaints = await Complaint.find(filter)
            .populate("citizenId", "name phone")
            .populate("assignedMcId", "name email")
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, complaints });
    } catch (err) {
        console.error("GetAllComplaints Error:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// PATCH /api/complaints/:id/status — Update complaint status (MC/Admin)
exports.updateComplaintStatus = async (req, res) => {
    try {
        const { status, assignedWorker } = req.body;
        const updateData = { status };
        if (assignedWorker) updateData.assignedWorker = assignedWorker;

        const complaint = await Complaint.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            updateData,
            { new: true }
        );

        if (!complaint) {
            return res.status(404).json({ success: false, message: "Complaint not found." });
        }

        res.status(200).json({ success: true, message: "Status updated.", complaint });
    } catch (err) {
        console.error("UpdateStatus Error:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// DELETE /api/complaints/:id — Soft delete
exports.softDeleteComplaint = async (req, res) => {
    try {
        const complaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            { isDeleted: true },
            { new: true }
        );
        if (!complaint) {
            return res.status(404).json({ success: false, message: "Complaint not found." });
        }
        res.status(200).json({ success: true, message: "Complaint archived." });
    } catch (err) {
        console.error("SoftDeleteComplaint Error:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
