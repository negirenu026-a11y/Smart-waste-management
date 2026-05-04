const Complaint = require("../models/mcDetails/complaintModel");
const User = require("../models/userModel");
const Area = require("../models/areaModel");
const path = require("path");

// POST /api/complaints — Create a new complaint
exports.createComplaint = async (req, res) => {
    try {
        const { type, category, description, district, city, area, location, ward, zone } = req.body;

        // 1. Try to find the area to get specific assigned MC
        let assignedMcId = null;
        const areaDoc = await Area.findOne({ district, city, name: area, isDeleted: false });
        
        if (areaDoc && areaDoc.mcId) {
            assignedMcId = areaDoc.mcId;
        } else {
            // 2. Fallback: Find ANY MC registered for this specific City + District
            const cityMc = await User.findOne({ 
                userType: "mc", 
                city: city, 
                district: district, 
                isDeleted: false 
            });
            
            if (cityMc) {
                assignedMcId = cityMc._id;
            }
        }
        
        if (!assignedMcId) {
            return res.status(400).json({ 
                success: false, 
                message: "No Municipal Corporation (MC) found for this city/area. Complaint cannot be filed." 
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
            assignedMcId,
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

        // MCs can only see complaints in their city/district
        if (req.user?.role === "mc") {
            const mcUser = await User.findById(req.user.id);
            if (mcUser) {
                filter.city = mcUser.city;
                filter.district = mcUser.district;
            } else {
                // Fallback to assignedMcId if user not found for some reason
                filter.assignedMcId = req.user.id;
            }
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
        const { status, assignedWorker, assignedWorkerId, deadline, completionNote } = req.body;
        const updateData = { status };
        
        if (assignedWorker) updateData.assignedWorker = assignedWorker;
        if (assignedWorkerId) updateData.assignedWorkerId = assignedWorkerId;
        if (deadline) updateData.deadline = deadline;
        if (completionNote) updateData.completionNote = completionNote;
        
        // If resolution proof is uploaded
        if (req.file) {
            updateData.proofImage = `/uploads/${req.file.filename}`;
        }

        const complaint = await Complaint.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            updateData,
            { new: true }
        );

        if (!complaint) {
            return res.status(404).json({ success: false, message: "Complaint not found." });
        }

        // If a worker is assigned and status is "In Process", create a task if it doesn't exist
        if (assignedWorkerId && status === "In Process") {
            const Task = require("../models/mcDetails/taskModel");
            const existingTask = await Task.findOne({ complaintId: complaint._id });
            if (!existingTask) {
                const newTask = new Task({
                    title: `Cleanup: ${complaint.category}`,
                    assignedTo: assignedWorker,
                    assignedToId: assignedWorkerId,
                    mcId: req.user.id,
                    deadline: deadline || "Asap",
                    complaintId: complaint._id,
                    status: "In Progress"
                });
                await newTask.save();
            }
        }

        res.status(200).json({ success: true, message: "Complaint updated successfully.", complaint });
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
