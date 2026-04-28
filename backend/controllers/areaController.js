const Area = require("../models/areaModel");

// GET /api/areas
exports.getAllAreas = async (req, res) => {
    try {
        const areas = await Area.find({ isDeleted: false }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, areas });
    } catch (err) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// POST /api/areas
exports.createArea = async (req, res) => {
    try {
        const { name, city, zone, ward, location } = req.body;
        const newArea = new Area({ name, city, zone, ward, location });
        await newArea.save();
        res.status(201).json({ success: true, area: newArea });
    } catch (err) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// PATCH /api/areas/:id
exports.updateArea = async (req, res) => {
    try {
        const updatedArea = await Area.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedArea) return res.status(404).json({ success: false, message: "Area not found" });
        res.status(200).json({ success: true, area: updatedArea });
    } catch (err) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// DELETE /api/areas/:id
exports.deleteArea = async (req, res) => {
    try {
        const area = await Area.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        if (!area) return res.status(404).json({ success: false, message: "Area not found" });
        res.status(200).json({ success: true, message: "Area deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
