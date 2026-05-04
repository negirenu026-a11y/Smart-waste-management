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
            setWorkers(res.data.workers || []);
        } catch (err) {
            console.error("Error fetching workers:", err);
        } finally {
            setLoading(false);
        }
    };

    const displayWorkers = workers;


    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate contact number (exactly 10 digits)
        const contactRegex = /^[0-9]{10}$/;
        if (!contactRegex.test(formData.contact)) {
            toast.warning("Contact number must be exactly 10 digits.");
            return;
        }

        try {
            if (editingWorker) {
                const res = await api.patch(`/workers/${editingWorker._id}`, formData);
                if (res.data.success) {
                    toast.success("Worker updated!");
                    fetchWorkers();
                }
            } else {
                const res = await api.post("/workers", { ...formData, mcId: user?._id });
                if (res.data.success) {
                    toast.success("Worker registered!");
                    fetchWorkers();
                }
            }
            setFormData({ name: "", contact: "", area: "", role: "" });
            setEditingWorker(null);
            setShowForm(false);
        } catch (err) {
            toast.error("Failed to save worker details.");
        }
    };

    const deleteWorker = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            const res = await api.delete(`/workers/${id}`);
            if (res.data.success) {
                toast.success("Worker removed.");
                fetchWorkers();
            }
        } catch (err) {
            toast.error("Failed to delete worker.");
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
        <div className="dashboard-section-wrap p-4">
            <header className="mb-4 d-flex justify-content-between align-items-center">
                <div>
                    <h2 className="fw-bold">Worker Directory</h2>
                    <p className="text-muted">Manage your field staff and zone assignments.</p>
                </div>
                <button 
                    className="btn btn-success px-4" 
                    style={{ background: '#10b981', border: 'none' }}
                    onClick={() => { setShowForm(!showForm); setEditingWorker(null); setFormData({ name: "", contact: "", area: "", role: "" }); }}
                >
                    <i className={`fas ${showForm ? "fa-times" : "fa-plus"} me-2`}></i> 
                    {showForm ? "Cancel" : "Register Worker"}
                </button>
            </header>

            {showForm && (
                <div className="dashboard-card mb-4 p-4 border-0 shadow-sm bg-white">
                    <h5 className="fw-bold mb-3">{editingWorker ? "Edit Worker Details" : "Register New Worker"}</h5>
                    <form onSubmit={handleSubmit} className="row g-3">
                        <div className="col-md-3">
                            <label className="form-label small fw-bold">Full Name</label>
                            <input type="text" name="name" className="form-control" placeholder="Worker name" value={formData.name} onChange={handleInputChange} required />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small fw-bold">Contact No</label>
                            <input 
                                type="text" 
                                name="contact" 
                                className="form-control" 
                                placeholder="10-digit number" 
                                value={formData.contact} 
                                onChange={handleInputChange} 
                                maxLength="10"
                                pattern="[0-9]{10}"
                                required 
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small fw-bold">Assigned Area</label>
                            <input 
                                type="text" 
                                name="area" 
                                className="form-control" 
                                placeholder="Type area name..." 
                                value={formData.area} 
                                onChange={handleInputChange} 
                                required 
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small fw-bold">Role</label>
                            <select name="role" className="form-select" value={formData.role} onChange={handleInputChange} required>
                                <option value="">Select Role</option>
                                <option value="Driver">Driver</option>
                                <option value="Sweeper">Sweeper</option>
                                <option value="Collector">Collector</option>
                                <option value="Supervisor">Supervisor</option>
                            </select>
                        </div>
                        <div className="col-12 text-end">
                            <button type="submit" className="btn btn-success px-5 fw-bold" style={{ background: '#10b981' }}>
                                {editingWorker ? "Update Worker" : "Register Worker"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="dashboard-card p-0 overflow-hidden shadow-sm border-0 bg-white">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th className="ps-4">Worker Info</th>
                                <th>Contact</th>
                                <th>Assigned Area</th>
                                <th>Role</th>
                                <th className="text-end pe-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5} className="text-center py-5">Loading workers...</td></tr>
                            ) : displayWorkers.length === 0 ? (
                                <tr><td colSpan={5} className="text-center py-5 text-muted">No workers found in your zone.</td></tr>
                            ) : (
                                displayWorkers.map((w) => (
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
                                            <div className="d-flex gap-2 justify-content-end">
                                                <button className="btn btn-sm btn-outline-primary" onClick={() => startEdit(w)}>
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => deleteWorker(w._id)}>
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

export default ManageWorkers;