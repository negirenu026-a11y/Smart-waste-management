const Task = require("../models/taskModel");

// Get all tasks (Admin/MC)
exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ isDeleted: false }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, tasks });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Create task
exports.createTask = async (req, res) => {
    try {
        const newTask = new Task(req.body);
        await newTask.save();
        res.status(201).json({ success: true, task: newTask });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Update task
exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            req.body,
            { new: true }
        );
        if (!task) return res.status(404).json({ success: false, message: "Task not found or archived." });
        res.status(200).json({ success: true, task });
    } catch (err) {
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
