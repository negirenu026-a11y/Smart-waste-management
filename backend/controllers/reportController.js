const Report = require("../models/reportModel");

// POST /api/reports — MC submits a weekly report
exports.submitReport = async (req, res) => {
    try {
        const { stats } = req.body; // stats is a JSON string from frontend
        const parsedStats = typeof stats === 'string' ? JSON.parse(stats) : stats;

        if (!req.file) {
            return res.status(400).json({ success: false, message: "PDF report file is required." });
        }

        const newReport = new Report({
            mcId: req.user.id,
            mcName: req.user.name,
            city: req.user.city || "",
            zone: req.user.zone || "",
            stats: parsedStats,
            pdfUrl: `/uploads/${req.file.filename}`
        });

        await newReport.save();

        res.status(201).json({
            success: true,
            message: "Weekly report submitted successfully.",
            report: newReport
        });
    } catch (err) {
        console.error("SubmitReport Error:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// GET /api/reports — List reports (Admin sees all, MC sees own)
exports.getAllReports = async (req, res) => {
    try {
        const filter = { isDeleted: false };
        if (req.user.role === "mc") {
            filter.mcId = req.user.id;
        }

        const reports = await Report.find(filter).sort({ createdAt: -1 });
        res.status(200).json({ success: true, reports });
    } catch (err) {
        console.error("GetAllReports Error:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// PATCH /api/reports/:id/respond — Admin responds to a report
exports.respondToReport = async (req, res) => {
    try {
        const { status, adminResponse } = req.body;

        const report = await Report.findByIdAndUpdate(
            req.params.id,
            { status, adminResponse },
            { new: true }
        );

        if (!report) {
            return res.status(404).json({ success: false, message: "Report not found." });
        }

        res.status(200).json({ success: true, message: "Response recorded.", report });
    } catch (err) {
        console.error("RespondReport Error:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
