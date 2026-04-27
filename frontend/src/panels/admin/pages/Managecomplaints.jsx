import React, { useState, useEffect } from "react";

const STATUS_COLORS = {
    Pending: "#ef4444",
    "In Process": "#f59e0b",
    Resolved: "#10b981",
};

const Managecomplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [filter, setFilter] = useState("All");

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('complaints') || '[]');
        setComplaints(saved);
    }, []);

    const handleStatusChange = (id, newStatus) => {
        const updated = complaints.map(c => c.id === id ? { ...c, status: newStatus } : c);
        setComplaints(updated);
        localStorage.setItem('complaints', JSON.stringify(updated));
    };

    const handleDelete = (id) => {
        if (!window.confirm("Are you sure you want to delete this complaint record?")) return;
        const updated = complaints.filter(c => c.id !== id);
        setComplaints(updated);
        localStorage.setItem('complaints', JSON.stringify(updated));
    };

    const filtered = filter === "All" ? complaints : complaints.filter((c) => c.status === filter);

    const statusCounts = complaints.reduce((acc, c) => {
        const s = c.status || "Pending";
        acc[s] = (acc[s] || 0) + 1;
        return acc;
    }, { All: complaints.length });

    return (
        <div className="dashboard-section-wrap p-4">
            <header className="mb-4">
                <h2 className="fw-bold">Global Complaint Management</h2>
                <p className="text-muted">Monitor and track waste management issues across all cities and zones.</p>
            </header>

            <div className="row g-4 mb-4">
                {['All', 'Pending', 'In Process', 'Resolved'].map((s) => (
                    <div key={s} className="col-md-3">
                        <div 
                            className={`dashboard-card p-3 shadow-sm border-0 bg-white text-center hover-lift ${filter === s ? 'border-bottom border-primary border-4' : ''}`}
                            onClick={() => setFilter(s)}
                            style={{ cursor: 'pointer' }}>
                            <h6 className="text-muted text-uppercase small fw-bold mb-1">{s}</h6>
                            <h3 className="fw-bold mb-0">{statusCounts[s] || 0}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="dashboard-card p-0 overflow-hidden shadow-sm border-0 bg-white">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th className="ps-4">Issue & Citizen</th>
                                <th>Regional Info</th>
                                <th>Ward & Location</th>
                                <th>Status</th>
                                <th className="pe-4 text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan={5} className="text-center text-muted py-5">No records found for the selected category.</td></tr>
                            ) : (
                                filtered.map((c) => (
                                    <tr key={c.id}>
                                        <td className="ps-4">
                                            <div className="d-flex align-items-center gap-3">
                                                {c.image && (
                                                    <img src={c.image} alt="Issue" className="rounded" style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
                                                )}
                                                <div>
                                                    <div className="fw-bold">{c.category || c.type}</div>
                                                    <div className="small text-muted">By: {c.citizenName}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <p className="mb-0"><strong>City:</strong> {c.city}</p>
                                            <p className="mb-0"><strong>Zone:</strong> {c.zone}</p>
                                        </td>
                                        <td>
                                            <p className="mb-0"><strong>Ward:</strong> {c.ward}</p>
                                            <p className="mb-0 text-muted small">{c.location}</p>
                                        </td>
                                        <td>
                                            <span className="badge" style={{ backgroundColor: `${STATUS_COLORS[c.status || 'Pending']}15`, color: STATUS_COLORS[c.status || 'Pending'], border: `1px solid ${STATUS_COLORS[c.status || 'Pending']}30` }}>
                                                {c.status || "Pending"}
                                            </span>
                                        </td>
                                        <td className="pe-4 text-end">
                                            <div className="d-flex gap-2 justify-content-end">
                                                <select 
                                                    className="form-select form-select-sm w-auto"
                                                    value={c.status || "Pending"}
                                                    onChange={(e) => handleStatusChange(c.id, e.target.value)}
                                                >
                                                    {Object.keys(STATUS_COLORS).map(s => <option key={s}>{s}</option>)}
                                                </select>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(c.id)}>
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
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

export default Managecomplaints;