const Task = require("../models/taskModel");

// Get all tasks (Admin/MC)
exports.getAllTasks = async (req, res) => {
    try {
        let filter = { isDeleted: false };
        if (req.user?.role === "mc") {
            filter.mcId = req.user.id;
        }
        const tasks = await Task.find(filter).sort({ createdAt: -1 });
        res.status(200).json({ success: true, tasks });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Create task
exports.createTask = async (req, res) => {
    try {
        const newTask = new Task({
            ...req.body,
            mcId: req.user.id
        });
        await newTask.save();
        res.status(201).json({ success: true, task: newTask });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Update task
exports.updateTask = async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.file) {
            updateData.proofImage = `/uploads/${req.file.filename}`;
            updateData.status = 'Completed'; // Automatically complete on proof upload if preferred
        }

        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            updateData,
            { new: true }
        );
        if (!task) return res.status(404).json({ success: false, message: "Task not found or archived." });
        res.status(200).json({ success: true, task });
    } catch (err) {
        console.error("UpdateTask Error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// Soft delete task
exports.deleteTask = async (req, res) => {
    try {
        await Task.findByIdAndUpdate(req.params.id, { isDeleted: true });
        res.status(200).json({ success: true, message: "Task deleted" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
