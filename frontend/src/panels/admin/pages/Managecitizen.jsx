import React, { useState, useEffect } from "react";
import { initialCitizenRecords } from "../../../utils/dashboardData";

const Managecitizens = () => {
    const [citizens, setCitizens] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('admin_citizens') || '[]');
        if (saved.length > 0) {
            setCitizens(saved);
        } else {
            // Seed with initial data but add missing fields
            const seeded = initialCitizenRecords.map(c => ({
                ...c,
                city: "Shimla",
                zone: "North",
                ward: "Ward 1",
                location: c.location || "Main Road"
            }));
            setCitizens(seeded);
            localStorage.setItem('admin_citizens', JSON.stringify(seeded));
        }
    }, []);

    const handleDelete = (id) => {
        if (!window.confirm("Are you sure you want to remove this citizen account?")) return;
        const updated = citizens.filter((u) => u.id !== id);
        setCitizens(updated);
        localStorage.setItem('admin_citizens', JSON.stringify(updated));
    };

    const filteredCitizens = citizens.filter(c => 
        (c.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.email || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="dashboard-section-wrap p-4">
            <header className="mb-4 d-flex justify-content-between align-items-center">
                <div>
                    <h2 className="fw-bold">Manage Citizens</h2>
                    <p className="text-muted">Overview of registered users and their details.</p>
                </div>
                <div className="search-bar" style={{ width: '300px' }}>
                    <input 
                        type="text" 
                        className="form-control shadow-sm border-0"
                        placeholder="Search by name or email..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </header>

            <div className="dashboard-card p-0 overflow-hidden shadow-sm border-0 bg-white">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th className="ps-4">Citizen</th>
                                <th>Regional Info</th>
                                <th>Ward & Location</th>
                                <th>Reports</th>
                                <th className="pe-4 text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCitizens.length === 0 ? (
                                <tr><td colSpan={5} className="text-center text-muted py-5">No citizens matching your search.</td></tr>
                            ) : (
                                filteredCitizens.map((c) => (
                                    <tr key={c.id}>
                                        <td className="ps-4">
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="avatar-xs bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: 32, height: 32, fontWeight: 'bold' }}>
                                                    {(c.name || "U")[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <span className="fw-bold d-block">{c.name}</span>
                                                    <small className="text-muted">{c.email}</small>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <p className="mb-0"><strong>City:</strong> {c.city || 'Shimla'}</p>
                                            <p className="mb-0"><strong>Zone:</strong> {c.zone || 'North'}</p>
                                        </td>
                                        <td>
                                            <p className="mb-0"><strong>Ward:</strong> {c.ward || 'Ward 1'}</p>
                                            <p className="mb-0 text-muted small">{c.location}</p>
                                        </td>
                                        <td><span className="badge bg-light text-dark border">{c.reports || 0}</span></td>
                                        <td className="pe-4 text-end">
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(c.id)}>
                                                <i className="fas fa-trash"></i>
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

export default Managecitizens;