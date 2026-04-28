import React, { useState, useEffect } from "react";
import api from "../../../utils/api";
import { toast } from "react-toastify";

const STATUS_COLORS = {
    Pending: "#ef4444",
    "In Process": "#f59e0b",
    Resolved: "#10b981",
};

const ManageComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("All");
    const [selectedComplaint, setSelectedComplaint] = useState(null);

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            setLoading(true);
            const res = await api.get("/complaints");
            setComplaints(res.data.complaints || []);
        } catch (err) {
            console.error("Error fetching complaints:", err);
            toast.error("Failed to fetch complaints.");
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            const res = await api.patch(`/complaints/${id}/status`, { status });
            if (res.data.success) {
                toast.success(`Status updated to ${status}`);
                fetchComplaints();
                if (selectedComplaint?._id === id) {
                    setSelectedComplaint(prev => ({ ...prev, status }));
                }
            }
        } catch (err) {
            toast.error("Failed to update status.");
        }
    };

    const filtered = filter === "All" ? complaints : (complaints || []).filter(c => c.status === filter);

    return (
        <div className="dashboard-section-wrap p-4">
            <header className="mb-4 d-flex justify-content-between align-items-center">
                <div>
                    <h2 className="fw-bold">Citizen Complaints</h2>
                    <p className="text-muted">Manage and track reports submitted by the public in your region.</p>
                </div>
                <div className="btn-group shadow-sm">
                    {['All', 'Pending', 'In Process', 'Resolved'].map(s => (
                        <button key={s} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-white bg-white'}`} onClick={() => setFilter(s)}>
                            {s}
                        </button>
                    ))}
                </div>
            </header>

            <div className="dashboard-card p-0 overflow-hidden shadow-sm border-0 bg-white">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th className="ps-4">Citizen & Image</th>
                                <th>Details</th>
                                <th>Regional Info</th>
                                <th>Status</th>
                                <th className="text-end pe-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5} className="text-center py-5">Loading complaints...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={5} className="text-center py-5 text-muted">No complaints found.</td></tr>
                            ) : (
                                filtered.map((c) => (
                                    <tr key={c._id}>
                                        <td className="ps-4" style={{ cursor: 'pointer' }} onClick={() => setSelectedComplaint(c)}>
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="position-relative">
                                                    {c.imageUrl ? (
                                                        <img src={`http://localhost:4000${c.imageUrl}`} alt="Report" className="rounded" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                                                    ) : (
                                                        <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                                                            <i className="fas fa-image text-muted"></i>
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="fw-bold mb-0 text-primary">{c.citizenName || "Guest"}</p>
                                                    <span className="badge bg-light text-dark border small">{c.category || c.type}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <p className="mb-0 text-truncate" style={{ maxWidth: '200px' }} title={c.description}>{c.description}</p>
                                            <small className="text-muted">{new Date(c.createdAt).toLocaleDateString()}</small>
                                        </td>
                                        <td>
                                            <div className="small">
                                                <p className="mb-0"><strong>City:</strong> {c.city}</p>
                                                <p className="mb-0"><strong>Zone:</strong> {c.zone}</p>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="badge rounded-pill" style={{ backgroundColor: `${STATUS_COLORS[c.status || 'Pending']}15`, color: STATUS_COLORS[c.status || 'Pending'], border: `1px solid ${STATUS_COLORS[c.status || 'Pending']}30` }}>
                                                {c.status || "Pending"}
                                            </span>
                                        </td>
                                        <td className="text-end pe-4">
                                            <div className="d-flex gap-2 justify-content-end align-items-center">
                                                <button className="btn btn-sm btn-outline-info" onClick={() => setSelectedComplaint(c)}>
                                                    <i className="fas fa-eye"></i>
                                                </button>
                                                <select 
                                                    className="form-select form-select-sm w-auto" 
                                                    value={c.status}
                                                    onChange={(e) => updateStatus(c._id, e.target.value)}
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="In Process">In Process</option>
                                                    <option value="Resolved">Resolved</option>
                                                </select>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Complaint Detail Modal */}
            {selectedComplaint && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content border-0 shadow">
                            <div className="modal-header bg-light">
                                <h5 className="modal-title fw-bold">Complaint Detailed View</h5>
                                <button type="button" className="btn-close" onClick={() => setSelectedComplaint(null)}></button>
                            </div>
                            <div className="modal-body p-4">
                                <div className="row g-4">
                                    <div className="col-md-6">
                                        {selectedComplaint.imageUrl ? (
                                            <img src={`http://localhost:4000${selectedComplaint.imageUrl}`} alt="Issue" className="img-fluid rounded shadow-sm border" style={{ maxHeight: '400px', width: '100%', objectFit: 'contain', background: '#f8f9fa' }} />
                                        ) : (
                                            <div className="bg-light rounded d-flex align-items-center justify-content-center border" style={{ height: '300px' }}>
                                                <i className="fas fa-image fa-4x text-muted"></i>
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <span className="badge rounded-pill mb-2" style={{ backgroundColor: `${STATUS_COLORS[selectedComplaint.status || 'Pending']}15`, color: STATUS_COLORS[selectedComplaint.status || 'Pending'], border: `1px solid ${STATUS_COLORS[selectedComplaint.status || 'Pending']}30` }}>
                                                {selectedComplaint.status || "Pending"}
                                            </span>
                                            <h3 className="fw-bold mb-0">{selectedComplaint.category || selectedComplaint.type}</h3>
                                            <small className="text-muted">Reported on {new Date(selectedComplaint.createdAt).toLocaleString()}</small>
                                        </div>
                                        
                                        <hr />

                                        <div className="mb-4">
                                            <label className="text-muted small fw-bold d-block text-uppercase mb-2">Issue Description</label>
                                            <div className="p-3 bg-light rounded" style={{ minHeight: '100px' }}>
                                                {selectedComplaint.description || "No detailed description provided."}
                                            </div>
                                        </div>

                                        <div className="row g-3">
                                            <div className="col-sm-6">
                                                <label className="text-muted small fw-bold d-block text-uppercase">Reported By</label>
                                                <p className="fw-bold mb-0">{selectedComplaint.citizenName}</p>
                                            </div>
                                            <div className="col-sm-6">
                                                <label className="text-muted small fw-bold d-block text-uppercase">Ward / Zone</label>
                                                <p className="mb-0">{selectedComplaint.ward} | {selectedComplaint.zone}</p>
                                            </div>
                                            <div className="col-sm-6">
                                                <label className="text-muted small fw-bold d-block text-uppercase">City</label>
                                                <p className="mb-0">{selectedComplaint.city}</p>
                                            </div>
                                            <div className="col-12">
                                                <label className="text-muted small fw-bold d-block text-uppercase">Specific Location</label>
                                                <p className="mb-0"><i className="fas fa-map-marker-alt text-danger me-2"></i>{selectedComplaint.location}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer bg-light border-0">
                                <div className="d-flex w-100 justify-content-between align-items-center">
                                    <div className="d-flex gap-3 align-items-center">
                                        <label className="small fw-bold text-uppercase text-muted">Quick Action:</label>
                                        <select 
                                            className="form-select form-select-sm w-auto"
                                            value={selectedComplaint.status || "Pending"}
                                            onChange={(e) => updateStatus(selectedComplaint._id, e.target.value)}
                                        >
                                            {Object.keys(STATUS_COLORS).map(s => <option key={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <button type="button" className="btn btn-secondary px-4" onClick={() => setSelectedComplaint(null)}>Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageComplaints;