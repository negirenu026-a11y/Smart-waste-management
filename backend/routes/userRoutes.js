const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const userController = require("../controllers/userController");
const complaintController = require("../controllers/complaintController");
const workerController = require("../controllers/workerController");
const taskController = require("../controllers/taskController");
const { authMiddleware, requireRole } = require("../middleware/authMiddleware");

// ── Multer: File Upload Config ─────────────────────────────────────────────
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../uploads"));
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e6)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|gif|webp/;
        const ext = allowed.test(path.extname(file.originalname).toLowerCase());
        const mime = allowed.test(file.mimetype);
        if (ext && mime) return cb(null, true);
        cb(new Error("Only image files are allowed."));
    }
});

// ── Auth Routes ────────────────────────────────────────────────────────────
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);

// ── User Management Routes (Admin only) ────────────────────────────────────
router.get("/users", authMiddleware, requireRole("admin"), userController.getAllUsers);
router.delete("/users/:id", authMiddleware, requireRole("admin"), userController.softDeleteUser);

// ── Complaint Routes ────────────────────────────────────────────────────────
router.post("/complaints", authMiddleware, upload.single("image"), complaintController.createComplaint);
router.get("/complaints", authMiddleware, complaintController.getAllComplaints);
router.patch("/complaints/:id/status", authMiddleware, requireRole("mc", "admin"), complaintController.updateComplaintStatus);
router.delete("/complaints/:id", authMiddleware, complaintController.softDeleteComplaint);

// ── Worker Routes ──────────────────────────────────────────────────────────
router.get("/workers", authMiddleware, workerController.getAllWorkers);
router.post("/workers", authMiddleware, requireRole("mc", "admin"), workerController.createWorker);
router.patch("/workers/:id", authMiddleware, requireRole("mc", "admin"), workerController.updateWorker);
router.delete("/workers/:id", authMiddleware, requireRole("mc", "admin"), workerController.deleteWorker);

// ── Task Routes ────────────────────────────────────────────────────────────
router.get("/tasks", authMiddleware, taskController.getAllTasks);
router.post("/tasks", authMiddleware, requireRole("mc", "admin"), taskController.createTask);
router.patch("/tasks/:id", authMiddleware, requireRole("mc", "admin"), taskController.updateTask);
router.delete("/tasks/:id", authMiddleware, requireRole("mc", "admin"), taskController.deleteTask);

module.exports = router;
