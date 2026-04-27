import React, { useState, useEffect } from "react";
import { cities, zones } from "../../../utils/dashboardData";

const Manageareas = () => {
    const [areas, setAreas] = useState([]);
    const [form, setForm] = useState({ 
        name: "", 
        city: "", 
        zone: "", 
        ward: "", 
        location: "" 
    });

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('admin_areas') || '[]');
        setAreas(saved);
    }, []);

    const handleChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleAdd = (e) => {
        e.preventDefault();
        const newArea = { ...form, id: Date.now() };
        const updated = [...areas, newArea];
        setAreas(updated);
        localStorage.setItem('admin_areas', JSON.stringify(updated));
        setForm({ name: "", city: "", zone: "", ward: "", location: "" });
        alert("Area added successfully!");
    };

    const handleDelete = (id) => {
        if (!window.confirm("Delete this area?")) return;
        const updated = areas.filter((a) => a.id !== id);
        setAreas(updated);
        localStorage.setItem('admin_areas', JSON.stringify(updated));
    };

    return (
        <div className="dashboard-section-wrap p-4">
            <header className="mb-4">
                <h2 className="fw-bold">Manage Areas</h2>
                <p className="text-muted">Define and manage operational zones and specific locations.</p>
            </header>

            <div className="dashboard-card p-4 mb-4 shadow-sm border-0 bg-white">
                <h5 className="fw-bold mb-4">Add New Service Area</h5>
                <form onSubmit={handleAdd}>
                    <div className="row g-3">
                        <div className="col-md-4">
                            <label className="form-label small fw-bold">Area Name</label>
                            <input className="form-control" name="name" placeholder="e.g. Park Avenue"
                                value={form.name} onChange={handleChange} required />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label small fw-bold">City</label>
                            <select className="form-select" name="city" value={form.city} onChange={handleChange} required>
                                <option value="">Select City</option>
                                {cities.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label small fw-bold">Zone</label>
                            <select className="form-select" name="zone" value={form.zone} onChange={handleChange} required>
                                <option value="">Select Zone</option>
                                {zones.map(z => <option key={z} value={z}>{z}</option>)}
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label small fw-bold">Ward</label>
                            <input className="form-control" name="ward" placeholder="e.g. Ward 12"
                                value={form.ward} onChange={handleChange} required />
                        </div>
                        <div className="col-md-8">
                            <label className="form-label small fw-bold">Specific Location</label>
                            <input className="form-control" name="location" placeholder="e.g. Near Main Market"
                                value={form.location} onChange={handleChange} required />
                        </div>
                        <div className="col-12 text-end">
                            <button className="btn btn-primary px-4" type="submit">
                                Add Area
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
                                <th className="ps-4">Area Name</th>
                                <th>City</th>
                                <th>Zone / Ward</th>
                                <th>Location</th>
                                <th className="pe-4 text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {areas.length === 0 ? (
                                <tr><td colSpan={5} className="text-center text-muted py-5">No operational areas defined yet.</td></tr>
                            ) : (
                                areas.map((area) => (
                                    <tr key={area.id}>
                                        <td className="ps-4 fw-bold">{area.name}</td>
                                        <td>{area.city}</td>
                                        <td>{area.zone} - {area.ward}</td>
                                        <td>{area.location}</td>
                                        <td className="pe-4 text-end">
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(area.id)}>
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

export default Manageareas;