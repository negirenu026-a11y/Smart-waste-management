import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = "http://localhost:4000/api";

export function CitizenModuleView({ sectionId, savedUser, complaints, setComplaints }) {
    const [submitting, setSubmitting] = useState(false);
    const [statusMessage, setStatusMessage] = useState(null);

    const handleReportSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setStatusMessage(null);

        const formData = new FormData(e.target);
        const token = localStorage.getItem("wastewise-token");

        try {
            const res = await axios.post(`${API_BASE_URL}/complaints`, formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.data.success) {
                setComplaints(prev => [res.data.complaint, ...prev]);
                setStatusMessage({ type: 'success', text: "Complaint filed successfully!" });
                e.target.reset();
            }
        } catch (err) {
            setStatusMessage({ type: 'danger', text: err.response?.data?.message || "Failed to file complaint." });
        } finally {
            setSubmitting(false);
        }
    };

    if (sectionId === "report") {
        return (
            <div className="dashboard-card p-4">
                <h5 className="mb-4">Report Waste Overflow</h5>
                {statusMessage && (
                    <div className={`alert alert-${statusMessage.type} small py-2 mb-3`}>
                        {statusMessage.text}
                    </div>
                )}
                <form className="report-form" onSubmit={handleReportSubmit}>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label small font-weight-bold">Type of Issue</label>
                            <select name="type" className="form-select" required>
                                <option value="Waste Overflow">Waste Overflow</option>
                                <option value="Illegal Dumping">Illegal Dumping</option>
                                <option value="Blocked Drain">Blocked Drain</option>
                                <option value="Street Garbage">Street Garbage</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label small font-weight-bold">Category</label>
                            <select name="category" className="form-select" required>
                                <option value="Food Waste">Food Waste</option>
                                <option value="Plastic / Dry Waste">Plastic / Dry Waste</option>
                                <option value="Hazardous Waste">Hazardous Waste</option>
                                <option value="Construction Debris">Construction Debris</option>
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label small font-weight-bold">Area / Landmark</label>
                            <input name="area" className="form-control" placeholder="e.g. Near Bus Stand" required />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label small font-weight-bold">Exact Location (GPS/Address)</label>
                            <input name="location" className="form-control" placeholder="e.g. 12th Cross Street" required />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label small font-weight-bold">Ward No.</label>
                            <input name="ward" className="form-control" placeholder="e.g. Ward 4" />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label small font-weight-bold">Zone</label>
                            <select name="zone" className="form-select">
                                <option value="North">North Zone</option>
                                <option value="South">South Zone</option>
                                <option value="East">East Zone</option>
                                <option value="West">West Zone</option>
                                <option value="Central">Central</option>
                            </select>
                        </div>
                        <div className="col-12">
                            <label className="form-label small font-weight-bold">Description</label>
                            <textarea name="description" className="form-control" rows="3" placeholder="Provide more details..."></textarea>
                        </div>
                        <div className="col-12">
                            <label className="form-label small font-weight-bold">Upload Evidence Photo</label>
                            <input type="file" name="image" className="form-control" accept="image/*" />
                        </div>
                        <input type="hidden" name="city" value={savedUser?.city || 'Dharamshala'} />
                    </div>
                    <button type="submit" className="btn btn-primary mt-4 w-100 py-2 fw-bold shadow-sm" disabled={submitting}>
                        {submitting ? "Submitting..." : "File Complaint"}
                    </button>
                </form>
            </div>
        );
    }

    if (sectionId === "history") {
        return (
            <div className="dashboard-card p-4 bg-transparent border-0 shadow-none">
                <h5 className="mb-4">Your Complaint History</h5>
                <div className="row g-4">
                    {complaints.length > 0 ? (
                        complaints.map(c => (
                            <div className="col-md-6 col-lg-4" key={c._id}>
                                <div className="dashboard-card p-3 h-100 hover-lift d-flex flex-column" style={{ transition: 'all 0.3s ease' }}>
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <span className={`badge bg-${c.status === 'Resolved' ? 'success' : c.status === 'In Process' ? 'info' : 'warning'}`}>
                                            {c.status}
                                        </span>
                                        <small className="text-muted fw-bold">{new Date(c.createdAt).toLocaleDateString()}</small>
                                    </div>
                                    <h6 className="fw-bold mb-1">{c.type}</h6>
                                    <p className="small text-muted mb-3"><i className="fas fa-map-marker-alt text-danger me-1"></i> {c.area}</p>
                                    
                                    <div className="mt-auto bg-light p-2 rounded small">
                                        <span className="text-muted d-block mb-1">Status Tracking:</span>
                                        <div className="d-flex justify-content-between text-xs fw-bold">
                                            <span className="text-success">Submitted</span>
                                            <span className={c.status !== 'Pending' ? 'text-success' : 'text-muted'}>In Progress</span>
                                            <span className={c.status === 'Resolved' ? 'text-success' : 'text-muted'}>Resolved</span>
                                        </div>
                                        <div className="progress mt-1" style={{height: 4}}>
                                            <div className={`progress-bar bg-success`} role="progressbar" style={{width: c.status === 'Resolved' ? '100%' : c.status === 'In Process' ? '50%' : '10%'}}></div>
                                        </div>
                                        {c.assignedWorker && <div className="mt-2 text-primary fw-bold"><i className="fas fa-user-hard-hat me-1"></i> Assigned: {c.assignedWorker}</div>}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center py-5 dashboard-card">
                            <i className="fas fa-clipboard-check fa-3x text-success mb-3 opacity-50"></i>
                            <h5 className="text-muted">No complaints filed yet.</h5>
                            <p className="small text-muted">You are helping keep the environment clean!</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return null;
}
