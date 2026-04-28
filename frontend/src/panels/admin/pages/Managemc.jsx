import React, { useState, useEffect } from "react";
import api from "../../../utils/api";
import { toast } from "react-toastify";

const Managemc = () => {
    const [mcUsers, setMcUsers] = useState([]);
    const [areas, setAreas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ 
        fullName: "", 
        email: "", 
        password: "", 
        city: "", 
        zone: "", 
        ward: "", 
        location: "" 
    });
    const [editingMc, setEditingMc] = useState(null);

    useEffect(() => {
        fetchMCs();
        fetchAreas();
    }, []);

    const fetchMCs = async () => {
        try {
            setLoading(true);
            const res = await api.get("/users");
            const mcs = res.data.users.filter(u => u.userType === 'mc');
            setMcUsers(mcs);
        } catch (err) {
            toast.error("Failed to fetch Municipal Corporations.");
        } finally {
            setLoading(false);
        }
    };

    const fetchAreas = async () => {
        try {
            const res = await api.get("/areas");
            setAreas(res.data.areas || []);
        } catch (err) {
            console.error("Error fetching areas:", err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'city') {
            setForm((prev) => ({ ...prev, city: value, zone: '', ward: '', location: '' }));
        } else if (name === 'zone') {
            setForm((prev) => ({ ...prev, zone: value, ward: '', location: '' }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleAddMC = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/register", {
                ...form,
                name: form.fullName,
                userType: "mc"
            });
            
            if (res.data.success) {
                toast.success("Municipal Corporation added successfully!");
                setForm({ fullName: "", email: "", password: "", city: "", zone: "", ward: "", location: "" });
                fetchMCs();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to add MC account.");
        }
    };

    const handleUpdateMC = async (e) => {
        e.preventDefault();
        try {
            const res = await api.patch(`/users/${editingMc._id}`, {
                ...form,
                name: form.fullName
            });
            
            if (res.data.success) {
                toast.success("MC account updated successfully!");
                setEditingMc(null);
                setForm({ fullName: "", email: "", password: "", city: "", zone: "", ward: "", location: "" });
                fetchMCs();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update MC account.");
        }
    };

    const startEdit = (mc) => {
        setEditingMc(mc);
        setForm({
            fullName: mc.name || mc.fullName || "",
            email: mc.email || "",
            password: "",
            city: mc.city || "",
            zone: mc.zone || "",
            ward: mc.ward || "",
            location: mc.location || ""
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            const res = await api.delete(`/users/${id}`);
            if (res.data.success) {
                toast.success("MC account deleted.");
                fetchMCs();
            }
        } catch (err) {
            toast.error("Failed to delete MC account.");
        }
    };

    // Derive dropdown options from fetched areas
    const availableCities = [...new Set(areas.map(a => a.city))];
    const availableZones = [...new Set(areas.filter(a => a.city === form.city).map(a => a.zone))];
    const availableWards = [...new Set(areas.filter(a => a.city === form.city && a.zone === form.zone).map(a => a.ward))];

    return (
        <div className="dashboard-section-wrap p-4">
            <header className="mb-4">
                <h2 className="fw-bold">Manage Municipal Corporations</h2>
                <p className="text-muted">Assign MCs to specific registered operational areas.</p>
            </header>

            <div className="dashboard-card p-4 mb-4 shadow-sm border-0 bg-white">
                <h5 className="fw-bold mb-4">{editingMc ? "Edit MC Account" : "Register New MC"}</h5>
                <form onSubmit={editingMc ? handleUpdateMC : handleAddMC}>
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
                            <label className="form-label small fw-bold">Password {editingMc && "(Leave blank to keep current)"}</label>
                            <input className="form-control" name="password" type="password" placeholder="••••••••"
                                value={form.password} onChange={handleChange} required={!editingMc} />
                        </div>
                        
                        <div className="col-md-3">
                            <label className="form-label small fw-bold">Assigned City</label>
                            <select className="form-select" name="city" value={form.city} onChange={handleChange} required>
                                <option value="">Select City</option>
                                {availableCities.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small fw-bold">Assigned Zone</label>
                            <select className="form-select" name="zone" value={form.zone} onChange={handleChange} required disabled={!form.city}>
                                <option value="">Select Zone</option>
                                {availableZones.map(z => <option key={z} value={z}>{z}</option>)}
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small fw-bold">Primary Ward</label>
                            <select className="form-select" name="ward" value={form.ward} onChange={handleChange} required disabled={!form.zone}>
                                <option value="">Select Ward</option>
                                {availableWards.map(w => <option key={w} value={w}>{w}</option>)}
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small fw-bold">Office Location</label>
                            <input className="form-control" name="location" placeholder="e.g. Town Hall"
                                value={form.location} onChange={handleChange} required />
                        </div>

                        <div className="col-12 text-end gap-2 d-flex justify-content-end mt-4">
                            {editingMc && (
                                <button className="btn btn-light px-4" type="button" onClick={() => {
                                    setEditingMc(null);
                                    setForm({ fullName: "", email: "", password: "", city: "", zone: "", ward: "", location: "" });
                                }}>Cancel</button>
                            )}
                            <button className="btn btn-primary px-4 fw-bold" type="submit">
                                {editingMc ? "Update MC account" : "Register MC account"}
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
                                <th>Assigned Jurisdiction</th>
                                <th>Ward & Location</th>
                                <th>Status</th>
                                <th className="pe-4 text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5} className="text-center py-5">Loading Municipal Corporations...</td></tr>
                            ) : mcUsers.length === 0 ? (
                                <tr><td colSpan={5} className="text-center text-muted py-5">No Municipal Corporations found.</td></tr>
                            ) : (
                                mcUsers.map((mc) => (
                                    <tr key={mc._id}>
                                        <td className="ps-4">
                                            <div className="fw-bold text-primary">{mc.name || mc.fullName}</div>
                                            <small className="text-muted">{mc.email}</small>
                                        </td>
                                        <td>
                                            <div className="d-flex flex-column">
                                                <span className="fw-bold">{mc.city}</span>
                                                <span className="small text-muted">{mc.zone} Zone</span>
                                            </div>
                                        </td>
                                        <td>
                                            <p className="mb-0"><strong>Ward:</strong> {mc.ward}</p>
                                            <p className="mb-0 small text-muted">{mc.location}</p>
                                        </td>
                                        <td><span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25">Active</span></td>
                                        <td className="pe-4 text-end">
                                            <div className="d-flex gap-2 justify-content-end">
                                                <button className="btn btn-sm btn-outline-primary" onClick={() => startEdit(mc)}>
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(mc._id)}>
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

export default Managemc;