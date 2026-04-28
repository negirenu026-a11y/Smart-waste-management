import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import api from "../../../utils/api";
import { toast } from 'react-toastify';

const WeeklyReport = () => {
    const [stats, setStats] = useState({
        workers: 0,
        tasks: 0,
        complaints: 0,
        resolvedTasks: 0,
        resolvedComplaints: 0
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // Fetch real data from backend
            const [workersRes, tasksRes, complaintsRes] = await Promise.all([
                api.get("/workers"),
                api.get("/tasks"),
                api.get("/complaints")
            ]);

            const workers = workersRes.data.workers || [];
            const tasks = tasksRes.data.tasks || [];
            const complaints = complaintsRes.data.complaints || [];

            setStats({
                workers: workers.length,
                tasks: tasks.length,
                complaints: complaints.length,
                resolvedTasks: tasks.filter(t => t.status === 'Resolved' || t.status === 'Completed').length,
                resolvedComplaints: complaints.filter(c => c.status === 'Resolved' || c.status === 'Completed').length
            });
        } catch (err) {
            console.error("Error fetching stats:", err);
            // Fallback to localStorage if API fails (maybe not all connected yet)
            const workers = JSON.parse(localStorage.getItem('mc_workers') || '[]');
            const tasks = JSON.parse(localStorage.getItem('mc_tasks') || '[]');
            const complaints = JSON.parse(localStorage.getItem('mc_complaints') || '[]');

            setStats({
                workers: workers.length,
                tasks: tasks.length,
                complaints: complaints.length,
                resolvedTasks: tasks.filter(t => t.status === 'Resolved').length,
                resolvedComplaints: complaints.filter(c => c.status === 'Resolved').length
            });
        }
    };

    const handleSubmitReport = async () => {
        const reportElement = document.getElementById("report-content");
        if (!reportElement) return;

        setSubmitting(true);
        try {
            const canvas = await html2canvas(reportElement, { scale: 2 });
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            
            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            const pdfBlob = pdf.output("blob");

            const formData = new FormData();
            formData.append("report", pdfBlob, `Weekly_Report_${Date.now()}.pdf`);
            formData.append("stats", JSON.stringify(stats));

            const res = await api.post("/reports", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (res.data.success) {
                toast.success("Report submitted to Admin successfully!");
            }
        } catch (err) {
            console.error("Report Submission Error:", err);
            toast.error("Failed to submit report.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="dashboard-section-wrap">
            <header className="mb-4 d-flex justify-content-between align-items-center">
                <div>
                    <h2 className="fw-bold">Weekly Performance Report</h2>
                    <p className="text-muted mb-0">Consolidated overview of municipal operations and efficiency.</p>
                </div>
                <button 
                    className="btn btn-primary fw-bold px-4 rounded-pill shadow-sm" 
                    onClick={handleSubmitReport}
                    disabled={submitting}
                >
                    {submitting ? (
                        <><span className="spinner-border spinner-border-sm me-2" /> Submitting...</>
                    ) : (
                        <><i className="fas fa-paper-plane me-2" /> Submit to Admin</>
                    )}
                </button>
            </header>

            <div id="report-content" className="bg-white p-4 rounded-3 border">
                <div className="text-center mb-4 border-bottom pb-3">
                    <h3 className="fw-bold text-success">WasteWise Municipal Report</h3>
                    <p className="text-muted small">Generated on {new Date().toLocaleDateString()}</p>
                </div>

                <div className="row g-4 mb-5">
                    <div className="col-md-4">
                        <div className="dashboard-card text-center p-4 border shadow-none">
                            <div className="display-4 fw-bold text-success mb-2">{stats.workers}</div>
                            <h6 className="text-muted text-uppercase small fw-bold">Field Workforce</h6>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="dashboard-card text-center p-4 border shadow-none">
                            <div className="display-4 fw-bold text-primary mb-2">{stats.tasks}</div>
                            <h6 className="text-muted text-uppercase small fw-bold">Total Tasks Created</h6>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="dashboard-card text-center p-4 border shadow-none">
                            <div className="display-4 fw-bold text-warning mb-2">{stats.complaints}</div>
                            <h6 className="text-muted text-uppercase small fw-bold">Total Complaints Received</h6>
                        </div>
                    </div>
                </div>

                <div className="dashboard-card border shadow-none mb-4">
                    <h5 className="fw-bold mb-4 px-4 pt-4">Efficiency Breakdown</h5>
                    <div className="table-responsive px-4 pb-4">
                        <table className="table table-bordered align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>Category</th>
                                    <th>Total Count</th>
                                    <th>Resolved / Completed</th>
                                    <th>Efficiency (%)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="fw-bold">Public Complaints</td>
                                    <td>{stats.complaints}</td>
                                    <td>{stats.resolvedComplaints}</td>
                                    <td>
                                        {stats.complaints > 0 
                                            ? Math.round((stats.resolvedComplaints / stats.complaints) * 100) 
                                            : 0}%
                                    </td>
                                </tr>
                                <tr>
                                    <td className="fw-bold">Maintenance Tasks</td>
                                    <td>{stats.tasks}</td>
                                    <td>{stats.resolvedTasks}</td>
                                    <td>
                                        {stats.tasks > 0 
                                            ? Math.round((stats.resolvedTasks / stats.tasks) * 100) 
                                            : 0}%
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="p-4 bg-light rounded-3">
                    <h6 className="fw-bold mb-2">Municipal Authentication:</h6>
                    <p className="small text-muted mb-0">I hereby certify that the above data is accurate and reflects the actual operational status of the assigned zone.</p>
                </div>
            </div>

            <div className="mt-4 p-4 bg-light rounded-3">
                <h6 className="fw-bold mb-2">Note:</h6>
                <p className="small text-muted mb-0">This report is generated based on real-time data from your municipal operational logs. Submitting this will send a PDF version to the Admin for review.</p>
            </div>
        </div>
    );
};

export default WeeklyReport;
