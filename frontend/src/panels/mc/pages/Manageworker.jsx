import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import api from "../../../utils/api";
import { toast } from "react-toastify";

const ManageWorkers = () => {
    const { user } = useOutletContext();
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingWorker, setEditingWorker] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        contact: "",
        area: "",
        role: ""
    });

    useEffect(() => {
        fetchWorkers();
    }, []);

    const fetchWorkers = async () => {
        try {
            setLoading(true);
            const res = await api.get("/workers");
            setWorkers(res.data.workers);
        } catch (err) {
            console.error("Error fetching workers:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingWorker) {
                const res = await api.patch(`/workers/${editingWorker._id}`, formData);
                if (res.data.success) fetchWorkers();
            } else {
                const res = await api.post("/workers", formData);
                if (res.data.success) fetchWorkers();
            }
            setFormData({ name: "", contact: "", area: "", role: "" });
            setEditingWorker(null);
            setShowForm(false);
        } catch (err) {
            toast.error("Failed to save worker details.");
        }
    };

    const deleteWorker = async (id) => {
        if (window.confirm("Are you sure?")) {
            try {
                const res = await api.delete(`/workers/${id}`);
                if (res.data.success) fetchWorkers();
            } catch (err) {
                toast.error("Failed to delete worker.");
            }
        }
    };

    const startEdit = (worker) => {
        setEditingWorker(worker);
        setFormData({
            name: worker.name,
            contact: worker.contact,
            area: worker.area,
            role: worker.role
        });
        setShowForm(true);
    };

    return (
        <div className="dashboard-section-wrap">
            <header className="mb-4 d-flex justify-content-between align-items-center">
                <div>
                    <h2 className="fw-bold">Worker Directory</h2>
                    <p className="text-muted">Manage your field staff and zone assignments.</p>
                </div>
                <button 
                    className="btn btn-success" 
                    style={{ background: '#10b981', border: 'none' }}
                    onClick={() => { setShowForm(true); setEditingWorker(null); setFormData({ name: "", contact: "", area: "", role: "" }); }}
                >
                    <i className="fas fa-plus me-2"></i> Register Worker
                </button>
            </header>

            {showForm && (
                <div className="dashboard-card mb-4 border-success">
                    <h5 className="fw-bold mb-3">{editingWorker ? "Edit Worker" : "Register New Worker"}</h5>
                    <form onSubmit={handleSubmit} className="row g-3">
                        <div className="col-md-3">
                            <input type="text" name="name" className="form-control" placeholder="Full Name" value={formData.name} onChange={handleInputChange} required />
                        </div>
                        <div className="col-md-3">
                            <input type="text" name="contact" className="form-control" placeholder="Contact No" value={formData.contact} onChange={handleInputChange} required />
                        </div>
                        <div className="col-md-3">
                            <input type="text" name="area" className="form-control" placeholder="Assigned Area" value={formData.area} onChange={handleInputChange} required />
                        </div>
                        <div className="col-md-3">
                            <select name="role" className="form-select" value={formData.role} onChange={handleInputChange} required>
                                <option value="">Select Role</option>
                                <option value="Driver">Driver</option>
                                <option value="Sweeper">Sweeper</option>
                                <option value="Collector">Collector</option>
                            </select>
                        </div>
                        <div className="col-12 text-end">
                            <button type="button" className="btn btn-light me-2" onClick={() => setShowForm(false)}>Cancel</button>
                            <button type="submit" className="btn btn-success" style={{ background: '#10b981' }}>
                                {editingWorker ? "Update Details" : "Register Worker"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="dashboard-card p-0 overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th className="ps-4">Worker Name</th>
                                <th>Contact</th>
                                <th>Area</th>
                                <th>Role</th>
                                <th className="text-end pe-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5} className="text-center py-5">Loading workers...</td></tr>
                            ) : workers.length === 0 ? (
                                <tr><td colSpan={5} className="text-center py-5 text-muted">No workers registered yet.</td></tr>
                            ) : (
                                workers.map((w) => (
                                    <tr key={w._id}>
                                        <td className="ps-4">
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="avatar-xs bg-success text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: 32, height: 32, background: '#10b981' }}>
                                                    {w.name ? w.name[0] : "W"}
                                                </div>
                                                <span className="fw-bold">{w.name}</span>
                                            </div>
                                        </td>
                                        <td>{w.contact}</td>
                                        <td>{w.area}</td>
                                        <td><span className="badge bg-light text-dark border">{w.role}</span></td>
                                        <td className="text-end pe-4">
                                            <button className="btn btn-sm btn-outline-primary me-2" onClick={() => startEdit(w)}>
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => deleteWorker(w._id)}>
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

export default ManageWorkers;