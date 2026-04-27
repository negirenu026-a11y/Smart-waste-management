import React, { useState, useEffect } from "react";
import { cities, zones } from "../../../utils/dashboardData";

const Managemc = () => {
    const [mcUsers, setMcUsers] = useState([]);
    const [form, setForm] = useState({ 
        fullName: "", 
        email: "", 
        password: "", 
        city: "", 
        zone: "", 
        ward: "", 
        location: "" 
    });

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('admin_mcs') || '[]');
        setMcUsers(saved);
    }, []);

    const handleChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleAddMC = (e) => {
        e.preventDefault();
        const newMC = { ...form, id: Date.now() };
        const updated = [...mcUsers, newMC];
        setMcUsers(updated);
        localStorage.setItem('admin_mcs', JSON.stringify(updated));
        setForm({ fullName: "", email: "", password: "", city: "", zone: "", ward: "", location: "" });
        alert("Municipal Corporation added successfully!");
    };

    const handleDelete = (id) => {
        if (!window.confirm("Are you sure you want to delete this MC?")) return;
        const updated = mcUsers.filter((u) => u.id !== id);
        setMcUsers(updated);
        localStorage.setItem('admin_mcs', JSON.stringify(updated));
    };

    return (
        <div className="dashboard-section-wrap p-4">
            <header className="mb-4">
                <h2 className="fw-bold">Manage Municipal Corporations</h2>
                <p className="text-muted">Register and monitor municipal corporation accounts.</p>
            </header>

            <div className="dashboard-card p-4 mb-4 shadow-sm border-0 bg-white">
                <h5 className="fw-bold mb-4">Register New MC</h5>
                <form onSubmit={handleAddMC}>
                    <div className="row g-3">
                        <div className="col-md-4">
                            <label className="form-label small fw-bold">Full Name</label>
                            <input className="form-control" name="fullName" placeholder="e.g. North MC"
                                value={form.fullName} onChange={handleChange} required />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label small fw-bold">Email Address</label>
                            <input className="form-control" name="email" type="email" placeholder="mc@example.com"
                                value={form.email} onChange={handleChange} required />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label small fw-bold">Password</label>
                            <input className="form-control" name="password" type="password" placeholder="••••••••"
                                value={form.password} onChange={handleChange} required />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small fw-bold">City</label>
                            <select className="form-select" name="city" value={form.city} onChange={handleChange} required>
                                <option value="">Select City</option>
                                {cities.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small fw-bold">Zone</label>
                            <select className="form-select" name="zone" value={form.zone} onChange={handleChange} required>
                                <option value="">Select Zone</option>
                                {zones.map(z => <option key={z} value={z}>{z}</option>)}
                            </select>
                        </div>
                        <div className="col-md-2">
                            <label className="form-label small fw-bold">Ward</label>
                            <input className="form-control" name="ward" placeholder="Ward 5"
                                value={form.ward} onChange={handleChange} required />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label small fw-bold">Location</label>
                            <input className="form-control" name="location" placeholder="Office Location"
                                value={form.location} onChange={handleChange} required />
                        </div>
                        <div className="col-12 text-end">
                            <button className="btn btn-primary px-4" type="submit">
                                Add MC Account
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <div className="dashboard-card p-0 overflow-hidden shadow-sm border-0 bg-white">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th className="ps-4">MC Name</th>
                                <th>Regional Info</th>
                                <th>Ward & Location</th>
                                <th>Status</th>
                                <th className="pe-4 text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mcUsers.length === 0 ? (
                                <tr><td colSpan={5} className="text-center text-muted py-5">No Municipal Corporations found.</td></tr>
                            ) : (
                                mcUsers.map((mc) => (
                                    <tr key={mc.id}>
                                        <td className="ps-4">
                                            <div className="fw-bold">{mc.fullName}</div>
                                            <small className="text-muted">{mc.email}</small>
                                        </td>
                                        <td>
                                            <p className="mb-0"><strong>City:</strong> {mc.city}</p>
                                            <p className="mb-0"><strong>Zone:</strong> {mc.zone}</p>
                                        </td>
                                        <td>
                                            <p className="mb-0"><strong>Ward:</strong> {mc.ward}</p>
                                            <p className="mb-0 small text-muted">{mc.location}</p>
                                        </td>
                                        <td><span className="badge bg-success">Active</span></td>
                                        <td className="pe-4 text-end">
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(mc.id)}>
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

export default Managemc;