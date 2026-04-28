const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
    mcId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    mcName: String,
    city: String,
    zone: String,
    stats: {
        workers: Number,
        tasks: Number,
        complaints: Number,
        resolvedTasks: Number,
        resolvedComplaints: Number
    },
    pdfUrl: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Reviewed", "Validated", "Rejected"],
        default: "Pending"
    },
    adminResponse: {
        type: String,
        default: ""
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model("Report", reportSchema);
