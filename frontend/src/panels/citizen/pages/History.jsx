import React, { useState, useEffect } from 'react';

const History = () => {
    const [complaints, setComplaints] = useState([]);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('complaints') || '[]');
        setComplaints(saved);
    }, []);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Resolved': return 'bg-success';
            case 'In Process': return 'bg-warning text-dark';
            default: return 'bg-danger';
        }
    };

    return (
        <div className="dashboard-section-wrap p-4">
            <header className="mb-4">
                <h2 className="fw-bold">Complaint History</h2>
                <p className="text-muted">Track the status of your previously submitted complaints.</p>
            </header>

            <div className="dashboard-card p-0 overflow-hidden shadow-sm border-0 bg-white">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th className="ps-4">Type</th>
                                <th>Location</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th className="text-end pe-4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {complaints.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-5">
                                        <div className="text-muted mb-3">
                                            <i className="fas fa-history fa-3x opacity-25 mb-2"></i>
                                            <p>No complaints found in your history.</p>
                                        </div>
                                        <button className="btn btn-outline-primary btn-sm" onClick={() => window.location.href='/citizen/complaint'}>
                                            Report an Issue
                                        </button>
                                    </td>
                                </tr>
                            ) : (
                                complaints.map((c) => (
                                    <tr key={c.id}>
                                        <td className="ps-4">
                                            <div className="d-flex align-items-center gap-3">
                                                {c.image && (
                                                    <img src={c.image} alt="Issue" className="rounded" style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
                                                )}
                                                <span className="fw-bold">{c.type || c.category}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="small text-muted d-block">{c.city}, {c.zone}</span>
                                            <span className="fw-semibold">{c.location}</span>
                                        </td>
                                        <td>{c.date}</td>
                                        <td>
                                            <span className={`badge rounded-pill ${getStatusBadge(c.status)}`}>
                                                {c.status}
                                            </span>
                                        </td>
                                        <td className="text-end pe-4">
                                            <button className="btn btn-sm btn-light" onClick={() => alert(`Details: ${c.description}`)}>
                                                <i className="fas fa-eye"></i>
                                            </button>
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

export default History;
