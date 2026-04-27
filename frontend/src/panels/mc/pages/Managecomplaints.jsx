import React, { useState, useEffect } from "react";

const ManageComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [filter, setFilter] = useState("All");

    useEffect(() => {
        // Read from the same key used by Citizen panel
        const saved = JSON.parse(localStorage.getItem('complaints') || '[]');
        setComplaints(saved);
    }, []);

    const updateStatus = (id, status) => {
        const updated = complaints.map(c => c.id === id ? { ...c, status } : c);
        localStorage.setItem('complaints', JSON.stringify(updated));
        setComplaints(updated);
    };

    const filtered = filter === "All" ? complaints : complaints.filter(c => c.status === filter);

    return (
        <div className="dashboard-section-wrap p-4">
            <header className="mb-4 d-flex justify-content-between align-items-center">
                <div>
                    <h2 className="fw-bold">Citizen Complaints</h2>
                    <p className="text-muted">Manage and track reports submitted by the public.</p>
                </div>
                <div className="btn-group shadow-sm">
                    {['All', 'Pending', 'In Process', 'Resolved'].map(s => (
                        <button key={s} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-white'}`} onClick={() => setFilter(s)}>
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
                                <th className="text-end pe-4">Update Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan={5} className="text-center py-5 text-muted">No complaints found.</td></tr>
                            ) : (
                                filtered.map((c) => (
                                    <tr key={c.id}>
                                        <td className="ps-4">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="position-relative">
                                                    {c.image ? (
                                                        <img src={c.image} alt="Report" className="rounded" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                                                    ) : (
                                                        <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                                                            <i className="fas fa-image text-muted"></i>
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="fw-bold mb-0">{c.citizenName || "Guest"}</p>
                                                    <span className="badge bg-light text-dark border small">{c.category || c.type}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <p className="mb-0 text-truncate" style={{ maxWidth: '200px' }} title={c.description}>{c.description}</p>
                                            <small className="text-muted">{c.date}</small>
                                        </td>
                                        <td>
                                            <div className="small">
                                                <p className="mb-0"><strong>City:</strong> {c.city}</p>
                                                <p className="mb-0"><strong>Zone:</strong> {c.zone} | <strong>Ward:</strong> {c.ward}</p>
                                                <p className="mb-0"><strong>Loc:</strong> {c.location}</p>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`badge rounded-pill ${c.status === 'Resolved' ? 'bg-success' : c.status === 'In Process' ? 'bg-warning text-dark' : 'bg-danger'}`}>
                                                {c.status}
                                            </span>
                                        </td>
                                        <td className="text-end pe-4">
                                            <select 
                                                className="form-select form-select-sm" 
                                                value={c.status}
                                                onChange={(e) => updateStatus(c.id, e.target.value)}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="In Process">In Process</option>
                                                <option value="Resolved">Resolved</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageComplaints;