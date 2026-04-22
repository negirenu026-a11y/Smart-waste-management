import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = "http://localhost:4000/api";

export function AdminModuleView({ 
    sectionId, 
    users, setUsers, 
    complaints, setComplaints, 
    workers, setWorkers 
}) {
    const token = localStorage.getItem("wastewise-token");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const [searchQuery, setSearchQuery] = useState("");
    const [showDeleted, setShowDeleted] = useState(false);
    const [showMcModal, setShowMcModal] = useState(false);
    const [editingMc, setEditingMc] = useState(null);

    const handleDeleteUser = async (id, isRestore = false) => {
        if (!isRestore && !window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await axios.delete(`${API_BASE_URL}/users/${id}?restore=${isRestore}`, config); // Assuming backend handles soft delete query
            setUsers(prev => prev.map(u => u._id === id ? { ...u, isDeleted: !isRestore } : u));
        } catch (err) {
            // For UI mock purposes, just update the state
            setUsers(prev => prev.map(u => u._id === id ? { ...u, isDeleted: !isRestore } : u));
        }
    };

    const handleSaveMc = (e) => {
        e.preventDefault();
        setShowMcModal(false);
        // Implement save logic for MC UI
    };

    // ── 1. Overview ──────────────────────────────────────────────────────────
    if (sectionId === "overview") {
        return (
            <div className="row g-4">
                <div className="col-md-12">
                    <div className="dashboard-card p-5 text-center bg-white">
                        <div className="mb-4">
                            <i className="fas fa-chart-pie fa-4x text-primary"></i>
                        </div>
                        <h4 className="fw-bold">System Administrator Overview</h4>
                        <p className="text-muted">Central monitoring and management for waste operations.</p>
                        <div className="d-flex justify-content-center gap-4 mt-4">
                            <div className="p-3 bg-light rounded border" style={{minWidth: 160}}>
                                <h2 className="mb-0 text-primary">{users.filter(u => u.userType === 'mc').length}</h2>
                                <small className="text-muted fw-bold">ACTIVE MCs</small>
                            </div>
                            <div className="p-3 bg-light rounded border" style={{minWidth: 160}}>
                                <h2 className="mb-0 text-primary">{workers.length}</h2>
                                <small className="text-muted fw-bold">FIELD STAFF</small>
                            </div>
                            <div className="p-3 bg-light rounded border" style={{minWidth: 160}}>
                                <h2 className="mb-0 text-primary">{complaints.length}</h2>
                                <small className="text-muted fw-bold">TOTAL REPORTS</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ── 2. Manage MCs ─────────────────────────────────────────────────────────
    if (sectionId === "mcs") {
        const mcs = users.filter(u => u.userType === 'mc' && (showDeleted ? u.isDeleted : !u.isDeleted));
        return (
            <div className="dashboard-card p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="m-0"><i className="fas fa-building me-2 text-primary"></i>Municipal Corporations</h5>
                    <div>
                        <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => setShowDeleted(!showDeleted)}>
                            {showDeleted ? "Hide Deleted" : "Show Deleted"}
                        </button>
                        <button className="btn btn-sm btn-primary" onClick={() => { setEditingMc({ mode: 'add' }); setShowMcModal(true); }}>Add New MC</button>
                    </div>
                </div>
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>MC Name</th>
                                <th>Contact Email</th>
                                <th>City</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mcs.map(u => (
                                <tr key={u._id} style={{ opacity: u.isDeleted ? 0.6 : 1, transition: 'all 0.3s ease' }}>
                                    <td><strong>{u.name}</strong></td>
                                    <td>{u.email}</td>
                                    <td>{u.city}</td>
                                    <td>
                                        {u.isDeleted ? <span className="badge bg-secondary">Deleted</span> : <span className="badge bg-success">Active</span>}
                                    </td>
                                    <td>
                                        {!u.isDeleted ? (
                                            <>
                                                <button className="btn btn-sm btn-outline-primary me-2" onClick={() => { setEditingMc({ ...u, mode: 'edit' }); setShowMcModal(true); }}><i className="fas fa-edit"></i></button>
                                                <button onClick={() => handleDeleteUser(u._id)} className="btn btn-sm btn-outline-danger"><i className="fas fa-trash"></i></button>
                                            </>
                                        ) : (
                                            <button onClick={() => handleDeleteUser(u._id, true)} className="btn btn-sm btn-outline-success"><i className="fas fa-undo"></i> Restore</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {showMcModal && (
                    <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div className="modal-content bg-white p-4 rounded shadow-lg" style={{ width: '400px', animation: 'scaleIn 0.2s ease-out' }}>
                            <h4 className="mb-4">{editingMc?.mode === 'edit' ? 'Update' : 'Add'} MC</h4>
                            <form onSubmit={handleSaveMc}>
                                <div className="mb-3">
                                    <label className="form-label">Name</label>
                                    <input name="name" className="form-control" defaultValue={editingMc?.name} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input type="email" name="email" className="form-control" defaultValue={editingMc?.email} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">City</label>
                                    <input name="city" className="form-control" defaultValue={editingMc?.city} required />
                                </div>
                                <div className="d-flex justify-content-end mt-4">
                                    <button type="button" onClick={() => setShowMcModal(false)} className="btn btn-light me-2">Cancel</button>
                                    <button type="submit" className="button button--primary">Save MC</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // ── 3. Manage Areas (Map Integration) ────────────────────────────────────
    if (sectionId === "areas") {
        return (
            <div className="dashboard-card p-0 overflow-hidden">
                <div className="p-4 border-bottom d-flex justify-content-between align-items-center bg-light">
                    <h5 className="m-0"><i className="fas fa-map-marked-alt me-2 text-primary"></i>Manage Areas & Zones</h5>
                    <div className="d-flex gap-2">
                        <div className="input-group input-group-sm">
                            <span className="input-group-text bg-white border-end-0"><i className="fas fa-search text-muted"></i></span>
                            <input 
                                type="text" 
                                className="form-control border-start-0" 
                                placeholder="Search area/ward..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button className="btn btn-sm btn-primary white-space-nowrap">Add Area</button>
                    </div>
                </div>
                <div className="row g-0">
                    <div className="col-lg-8 border-end">
                        {/* Map Integration Placeholder as requested */}
                        <div className="bg-light d-flex align-items-center justify-content-center" style={{height: 500, background: 'url("https://www.google.com/maps/vt/pb=!1m4!1m3!1i12!2i2365!3i1589!2m3!1e0!2sm!3i638139598!3m8!2sen!3sus!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0!5m1!5f2") center/cover'}}>
                            <div className="p-3 bg-white shadow rounded border text-center" style={{maxWidth: 250}}>
                                <i className="fas fa-map-marker-alt text-danger fa-2x mb-2"></i>
                                <h6 className="mb-1">Interactive Map View</h6>
                                <p className="small text-muted mb-0">Visual zone mapping and live worker tracking.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="p-3" style={{height: 500, overflowY: 'auto'}}>
                            <h6 className="mb-3 px-2 text-muted small fw-bold uppercase">Active Service Zones</h6>
                            {["North Zone", "West Sector", "Industrial Area", "Main Market", "Railway Colony"].filter(a => a.toLowerCase().includes(searchQuery.toLowerCase())).map(area => (
                                <div key={area} className="p-3 border rounded mb-2 hover-bg-light transition-all cursor-pointer">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="fw-bold">{area}</span>
                                        <span className="badge bg-primary-subtle text-primary small">Active</span>
                                    </div>
                                    <div className="mt-2 small text-muted">
                                        <i className="fas fa-trash-alt me-1"></i> 12 Bins • <i className="fas fa-user me-1"></i> 4 Workers
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ── 4. Manage Citizens ──────────────────────────────────────────────────
    if (sectionId === "citizens") {
        const activeCitizens = users.filter(u => u.userType === 'citizen' && (showDeleted ? u.isDeleted : !u.isDeleted))
            .filter(u => u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || u.city?.toLowerCase().includes(searchQuery.toLowerCase()));
        
        return (
            <div className="dashboard-card p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="m-0"><i className="fas fa-users me-2 text-primary"></i>Manage Citizens</h5>
                    <div className="d-flex gap-2">
                        <input 
                            type="text" 
                            className="form-control form-control-sm" 
                            placeholder="Filter by name/city..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button className="btn btn-sm btn-outline-secondary white-space-nowrap" onClick={() => setShowDeleted(!showDeleted)}>
                            {showDeleted ? "Hide Deleted" : "Show Deleted"}
                        </button>
                    </div>
                </div>
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Citizen</th>
                                <th>Role</th>
                                <th>Location (City)</th>
                                <th>Contact</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activeCitizens.map(u => (
                                <tr key={u._id} style={{ opacity: u.isDeleted ? 0.6 : 1, transition: 'all 0.3s ease' }}>
                                    <td>
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{width: 32, height: 32}}>
                                                {u.name ? u.name[0].toUpperCase() : 'U'}
                                            </div>
                                            <strong>{u.name}</strong>
                                        </div>
                                    </td>
                                    <td><span className="badge bg-info text-dark text-capitalize">{u.userType}</span></td>
                                    <td>{u.city || 'Not Specified'}</td>
                                    <td>{u.email}</td>
                                    <td>
                                        {!u.isDeleted ? (
                                            <button onClick={() => handleDeleteUser(u._id)} className="btn btn-sm btn-outline-danger"><i className="fas fa-trash"></i></button>
                                        ) : (
                                            <button onClick={() => handleDeleteUser(u._id, true)} className="btn btn-sm btn-outline-success"><i className="fas fa-undo"></i> Restore</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    // ── 5. Manage Workers ──────────────────────────────────────────────────
    if (sectionId === "workers") {
        return (
            <div className="dashboard-card p-4 bg-transparent border-0 shadow-none">
                <h5 className="mb-4"><i className="fas fa-hard-hat me-2 text-primary"></i>Field Workforce</h5>
                <div className="row g-4">
                    {workers.map(w => (
                        <div key={w._id} className="col-md-6 col-lg-4">
                            <div className="dashboard-card p-3 h-100 hover-lift d-flex flex-column" style={{ transition: 'all 0.3s ease' }}>
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div className="d-flex gap-3 align-items-center">
                                        <div className="bg-light text-primary rounded-circle d-flex align-items-center justify-content-center" style={{width: 48, height: 48, fontSize: '1.5rem'}}>
                                            <i className="fas fa-user-tie"></i>
                                        </div>
                                        <div>
                                            <h6 className="mb-0 fw-bold">{w.name}</h6>
                                            <small className="text-muted">{w.role}</small>
                                        </div>
                                    </div>
                                    <span className={`badge bg-${w.status === 'Active' ? 'success' : 'secondary'}`}>
                                        {w.status || 'Active'}
                                    </span>
                                </div>
                                <div className="mt-2 text-sm">
                                    <div className="mb-1"><i className="fas fa-map-marker-alt text-danger me-2"></i> <strong>Area:</strong> {w.area}</div>
                                    <div className="mb-1"><i className="fas fa-clock text-info me-2"></i> <strong>Availability:</strong> <span className={w.dutyStatus === 'On Duty' ? 'text-success fw-bold' : 'text-secondary'}>{w.dutyStatus || 'Off Duty'}</span></div>
                                    <div><i className="fas fa-phone text-secondary me-2"></i> {w.contact || 'N/A'}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // ── 6. Manage Complaints ────────────────────────────────────────────────
    if (sectionId === "complaints") {
        return (
            <div className="dashboard-card p-4">
                <h5 className="mb-4"><i className="fas fa-file-invoice me-2 text-primary"></i>Complaint Monitoring</h5>
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Category / Type</th>
                                <th>Location</th>
                                <th>Status</th>
                                <th>Priority</th>
                                <th>Reporter</th>
                            </tr>
                        </thead>
                        <tbody>
                            {complaints.map(c => (
                                <tr key={c._id}>
                                    <td>
                                        <div className="fw-bold">{c.type}</div>
                                        <small className="text-muted">{c.category || 'General'}</small>
                                    </td>
                                    <td>{c.city} ({c.area})</td>
                                    <td>
                                        <span className={`badge bg-${c.status === 'Resolved' ? 'success' : c.status === 'In Process' ? 'info' : 'warning'}`}>
                                            {c.status}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge bg-${c.priority === 'High' ? 'danger' : c.priority === 'Low' ? 'secondary' : 'warning'}-subtle text-${c.priority === 'High' ? 'danger' : c.priority === 'Low' ? 'secondary' : 'warning'}`}>
                                            {c.priority || 'Medium'}
                                        </span>
                                    </td>
                                    <td>{c.citizenName || 'Anonymous'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    return null;
}
