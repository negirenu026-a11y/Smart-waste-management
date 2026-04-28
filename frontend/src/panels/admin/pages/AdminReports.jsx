import React, { useState, useEffect } from "react";
import api from "../../../utils/api";
import { toast } from "react-toastify";

const AdminReports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [responseForm, setResponseForm] = useState({ id: null, status: "", response: "" });

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const res = await api.get("/reports");
            setReports(res.data.reports);
        } catch (err) {
            console.error("Error fetching reports:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleRespond = async (e) => {
        e.preventDefault();
        try {
            const res = await api.patch(`/reports/${responseForm.id}/respond`, {
                status: responseForm.status,
                adminResponse: responseForm.response
            });
            if (res.data.success) {
                toast.success("Response submitted successfully!");
                setResponseForm({ id: null, status: "", response: "" });
                fetchReports();
            }
        } catch (err) {
            toast.error("Failed to submit response.");
        }
    };

    return (
        <div className="dashboard-section-wrap p-4">
            <header className="mb-4">
                <h2 className="fw-bold">Review Municipal Reports</h2>
                <p className="text-muted">Validate and respond to weekly performance reports from zones.</p>
            </header>

            <div className="dashboard-card p-0 overflow-hidden shadow-sm border-0 bg-white">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th className="ps-4">MC Name</th>
                                <th>City / Zone</th>
                                <th>Submitted On</th>
                                <th>Status</th>
                                <th className="pe-4 text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5} className="text-center py-5">Loading reports...</td></tr>
                            ) : reports.length === 0 ? (
                                <tr><td colSpan={5} className="text-center text-muted py-5">No reports submitted yet.</td></tr>
                            ) : (
                                reports.map((report) => (
                                    <tr key={report._id}>
                                        <td className="ps-4">
                                            <div className="fw-bold">{report.mcName}</div>
                                            <a href={`http://localhost:4000${report.pdfUrl}`} target="_blank" rel="noreferrer" className="small text-primary text-decoration-none">
                                                <i className="fas fa-file-pdf me-1" /> View PDF Report
                                            </a>
                                        </td>
                                        <td>
                                            <p className="mb-0"><strong>City:</strong> {report.city}</p>
                                            <p className="mb-0 small text-muted"><strong>Zone:</strong> {report.zone}</p>
                                        </td>
                                        <td>{new Date(report.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`badge bg-${report.status === 'Validated' ? 'success' : report.status === 'Rejected' ? 'danger' : 'warning'}`}>
                                                {report.status}
                                            </span>
                                        </td>
                                        <td className="pe-4 text-end">
                                            <button 
                                                className="btn btn-sm btn-primary" 
                                                onClick={() => setResponseForm({ id: report._id, status: report.status, response: report.adminResponse || "" })}
                                            >
                                                Respond
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {responseForm.id && (
                <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg">
                            <form onSubmit={handleRespond}>
                                <div className="modal-header">
                                    <h5 className="modal-title fw-bold">Respond to Report</h5>
                                    <button type="button" className="btn-close" onClick={() => setResponseForm({ id: null, status: "", response: "" })}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">Update Status</label>
                                        <select 
                                            className="form-select" 
                                            value={responseForm.status} 
                                            onChange={(e) => setResponseForm({ ...responseForm, status: e.target.value })}
                                            required
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Reviewed">Reviewed</option>
                                            <option value="Validated">Validated</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">Admin Feedback / Response</label>
                                        <textarea 
                                            className="form-control" 
                                            rows="4" 
                                            placeholder="Provide feedback to the MC..."
                                            value={responseForm.response}
                                            onChange={(e) => setResponseForm({ ...responseForm, response: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-light" onClick={() => setResponseForm({ id: null, status: "", response: "" })}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">Save Response</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminReports;
