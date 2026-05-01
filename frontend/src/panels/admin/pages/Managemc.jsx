import React, { useState, useEffect } from "react";
import api from "../../../utils/api";
import { toast } from "react-toastify";
import { districts, HIMACHAL_DATA } from "../../../utils/dashboardData";

const Managemc = () => {
    const [mcUsers, setMcUsers] = useState([]);
    const [allAreas, setAllAreas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ 
        fullName: "", 
        email: "", 
        password: "", 
        district: "",
        city: "", 
        area: "",
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
            const res = await api.get("/mcs");
            setMcUsers(res.data.mcs || []);
        } catch (err) {
            toast.error("Failed to fetch Municipal Corporations.");
        } finally {
            setLoading(false);
        }
    };

    const fetchAreas = async () => {
        try {
            const res = await api.get("/areas");
            setAllAreas(res.data.areas || []);
        } catch (err) {
            console.error("Error fetching areas:", err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => {
            const updated = { ...prev, [name]: value };
            if (name === 'district') {
                updated.city = ''; updated.area = ''; updated.zone = ''; updated.ward = '';
            } else if (name === 'city') {
                updated.area = ''; updated.zone = ''; updated.ward = '';
            } else if (name === 'area') {
                // If area selection is now city-based as per Task 4/5
                updated.city = value;
                // Find district from HIMACHAL_DATA
                for (const dist in HIMACHAL_DATA) {
                    if (HIMACHAL_DATA[dist].includes(value)) {
                        updated.district = dist;
                        break;
                    }
                }
            }
            return updated;
        });
    };

    const handleAddMC = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/mcs", { ...form, name: form.fullName });
            if (res.data.success) {
                toast.success("Municipal Corporation added successfully!");
                resetForm();
                fetchMCs();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to add MC record.");
        }
    };

    const handleUpdateMC = async (e) => {
        e.preventDefault();
        try {
            const res = await api.patch(`/mcs/${editingMc._id}`, { ...form, name: form.fullName });
            if (res.data.success) {
                toast.success("MC record updated successfully!");
                resetForm();
                fetchMCs();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update MC record.");
        }
    };

    const startEdit = (mc) => {
        setEditingMc(mc);
        setForm({
            fullName: mc.name || "",
            email: mc.email || "",
            password: "",
            district: mc.district || "",
            city: mc.city || "",
            area: mc.area || "",
            zone: mc.zone || "",
            ward: mc.ward || "",
            location: mc.location || ""
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setEditingMc(null);
        setForm({ fullName: "", email: "", password: "", district: "", city: "", area: "", zone: "", ward: "", location: "" });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await api.delete(`/mcs/${id}`);
            toast.success("MC record deleted.");
            fetchMCs();
        } catch (err) {
            toast.error("Failed to delete MC record.");
        }
    };

    const filteredCities = form.district ? HIMACHAL_DATA[form.district] : [];
    const filteredAreas = allAreas.filter(a => a.city === form.city && a.district === form.district);

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
                            <input className="form-control" name="fullName" placeholder="e.g. MC Dharamshala"
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
                            <label className="form-label small fw-bold">District</label>
                            <select className="form-select" name="district" value={form.district} onChange={handleChange} required>
                                <option value="">Select District</option>
                                {districts.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small fw-bold">City</label>
                            <select className="form-select" name="city" value={form.city} onChange={handleChange} required disabled={!form.district}>
                                <option value="">Select City</option>
                                {filteredCities.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        {/* <div className="col-md-3">
                            <label className="form-label small fw-bold">Assigned Area (City)</label>
                            <select className="form-select" name="area" value={form.area} onChange={handleChange} required>
                                <option value="">Select City</option>
                                {[...new Set(allAreas.map(a => a.city))].sort().map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div> */}
                        <div className="col-md-3">
                            <label className="form-label small fw-bold">Office Location (Optional)</label>
                            <input className="form-control" name="location" placeholder="e.g. Town Hall"
                                value={form.location} onChange={handleChange} />
                        </div>

                        <div className="col-12 text-end gap-2 d-flex justify-content-end mt-4">
                            {editingMc && (
                                <button className="btn btn-light px-4" type="button" onClick={resetForm}>Cancel</button>
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
                                             <div className="fw-bold text-primary">{mc.name}</div>
                                             <small className="text-muted">{mc.email}</small>
                                         </td>
                                         <td>
                                             <div className="d-flex flex-column">
                                                 <span className="fw-bold">{mc.district}</span>
                                                 <span className="small text-muted">{mc.city} | {mc.zone || "Auto"}</span>
                                             </div>
                                         </td>
                                         <td>
                                             <p className="mb-0"><strong>Ward:</strong> {mc.ward || "N/A"}</p>
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