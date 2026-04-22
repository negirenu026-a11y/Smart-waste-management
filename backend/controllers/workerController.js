const Worker = require("../models/workerModel");

// Get all workers (Admin/MC)
exports.getAllWorkers = async (req, res) => {
    try {
        const workers = await Worker.find({ isDeleted: false }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, workers });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Create worker
exports.createWorker = async (req, res) => {
    try {
        const newWorker = new Worker(req.body);
        await newWorker.save();
        res.status(201).json({ success: true, worker: newWorker });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Update worker
exports.updateWorker = async (req, res) => {
    try {
        const worker = await Worker.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            req.body,
            { new: true }
        );
        if (!worker) return res.status(404).json({ success: false, message: "Worker not found or archived." });
        res.status(200).json({ success: true, worker });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Soft delete worker
exports.deleteWorker = async (req, res) => {
    try {
        await Worker.findByIdAndUpdate(req.params.id, { isDeleted: true });
        res.status(200).json({ success: true, message: "Worker deleted" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
