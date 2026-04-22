import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = "http://localhost:4000/api";

export function McModuleView({ 
    sectionId, 
    workers, setWorkers, 
    complaints, setComplaints, 
    tasks, setTasks 
}) {
    const [editingItem, setEditingItem] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [complaintFilter, setComplaintFilter] = useState('All');
    const [submitting, setSubmitting] = useState(false);

    const token = localStorage.getItem("wastewise-token");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const handleAddWorker = () => {
        setEditingItem({ mode: 'add' });
        setShowModal(true);
    };

    const handleEditWorker = (worker) => {
        setEditingItem({ ...worker, mode: 'edit' });
        setShowModal(true);
    };

    const handleDeleteWorker = async (id) => {
        if (window.confirm("Are you sure you want to remove this worker?")) {
            try {
                await axios.delete(`${API_BASE_URL}/workers/${id}`, config);
                setWorkers(prev => prev.filter(w => w._id !== id));
            } catch (err) {
                alert("Failed to delete worker.");
            }
        }
    };

    const handleSaveWorker = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const data = new FormData(e.target);
        const workerData = Object.fromEntries(data.entries());
        
        try {
            if (editingItem.mode === 'edit') {
                const res = await axios.patch(`${API_BASE_URL}/workers/${editingItem._id}`, workerData, config);
                setWorkers(prev => prev.map(w => w._id === editingItem._id ? res.data.worker : w));
            } else {
                const res = await axios.post(`${API_BASE_URL}/workers`, workerData, config);
                setWorkers(prev => [res.data.worker, ...prev]);
            }
            setShowModal(false);
        } catch (err) {
            alert("Failed to save worker.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleAssignWorker = async (complaintId, workerName) => {
        try {
            // Update complaint
            const compRes = await axios.patch(`${API_BASE_URL}/complaints/${complaintId}/status`, {
                status: 'In Process',
                assignedWorker: workerName
            }, config);
            
            setComplaints(prev => prev.map(c => c._id === complaintId ? compRes.data.complaint : c));

            // Create task
            const complaint = complaints.find(c => c._id === complaintId);
            const taskData = {
                title: `Resolve ${complaint.type} at ${complaint.area}`,
                assignedTo: workerName,
                status: 'Pending',
                priority: complaint.priority || 'Medium',
                deadline: 'Next 24h',
                complaintId: complaintId
            };
            const taskRes = await axios.post(`${API_BASE_URL}/tasks`, taskData, config);
            setTasks(prev => [taskRes.data.task, ...prev]);
        } catch (err) {
            alert("Failed to assign worker.");
        }
    };

    const handleUpdateTaskStatus = async (id, status) => {
        try {
            const res = await axios.patch(`${API_BASE_URL}/tasks/${id}`, { status }, config);
            setTasks(prev => prev.map(t => t._id === id ? res.data.task : t));
            
            if (status === 'Completed') {
                const task = tasks.find(t => t._id === id);
                if (task.complaintId) {
                    const compRes = await axios.patch(`${API_BASE_URL}/complaints/${task.complaintId}/status`, { status: 'Resolved' }, config);
                    setComplaints(prev => prev.map(c => c._id === task.complaintId ? compRes.data.complaint : c));
                }
            }
        } catch (err) {
            alert("Failed to update task status.");
        }
    };

    if (sectionId === "workforce") {
        return (
            <div className="dashboard-card p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h5 className="mb-1">Manage Workers</h5>
                        <p className="text-muted mb-0 small">Maintain your municipal workforce directory and schedules.</p>
                    </div>
                    <button onClick={handleAddWorker} className="button button--primary button--sm">
                        <i className="fas fa-plus me-2"></i> Add New Worker
                    </button>
                </div>
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
                                            <small className="text-muted">{w.role || 'Worker'}</small>
                                        </div>
                                    </div>
                                    <span className={`badge bg-${w.status === 'Active' ? 'success' : 'secondary'}`}>
                                        {w.status || 'Active'}
                                    </span>
                                </div>
                                <div className="mt-2 text-sm flex-grow-1">
                                    <div className="mb-1"><i className="fas fa-map-marker-alt text-danger me-2"></i> <strong>Zone:</strong> {w.area}</div>
                                    <div className="mb-1"><i className="fas fa-clock text-info me-2"></i> <strong>Schedule:</strong> {w.schedule || '09:00 - 17:00'}</div>
                                    <div className="mb-3"><i className="fas fa-phone text-secondary me-2"></i> {w.contact || 'N/A'}</div>
                                </div>
                                <div className="d-flex justify-content-end gap-2 mt-3 pt-3 border-top">
                                    <button onClick={() => handleEditWorker(w)} className="btn btn-sm btn-outline-primary"><i className="fas fa-edit"></i> Edit</button>
                                    <button onClick={() => handleDeleteWorker(w._id)} className="btn btn-sm btn-outline-danger"><i className="fas fa-trash"></i></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h4 className="mb-4">{editingItem.mode === 'edit' ? 'Update' : 'Add'} Worker Information</h4>
                            <form onSubmit={handleSaveWorker}>
                                <div className="mb-3">
                                    <label className="form-label">Full Name</label>
                                    <input name="name" className="form-control" defaultValue={editingItem.name} required />
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Contact Number</label>
                                        <input name="contact" className="form-control" defaultValue={editingItem.contact} required />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Assigned Zone</label>
                                        <input name="area" className="form-control" defaultValue={editingItem.area} required />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Working Hours (Schedule)</label>
                                    <input name="schedule" className="form-control" defaultValue={editingItem.schedule} placeholder="e.g. 08:00 AM - 04:00 PM" required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Account Status</label>
                                    <select name="status" className="form-select" defaultValue={editingItem.status || 'Active'}>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                                <div className="d-flex justify-content-end mt-4">
                                    <button type="button" onClick={() => setShowModal(false)} className="btn btn-light me-2">Cancel</button>
                                    <button type="submit" className="button button--primary" disabled={submitting}>
                                        {submitting ? "Saving..." : "Save Worker"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    if (sectionId === "pipeline") {
        const filteredComplaints = complaintFilter === 'All' 
            ? complaints 
            : complaints.filter(c => c.status === complaintFilter);

        return (
            <div className="dashboard-card p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h5 className="mb-1">Manage Complaints</h5>
                        <p className="text-muted mb-0 small">Assign workers to pending issues and track resolution status.</p>
                    </div>
                    <div className="btn-group btn-group-sm">
                        {['All', 'Pending', 'In Process', 'Resolved'].map(status => (
                            <button 
                                key={status}
                                className={`btn btn-outline-secondary ${complaintFilter === status ? 'active' : ''}`}
                                onClick={() => setComplaintFilter(status)}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead>
                            <tr>
                                <th>Complaint Details</th>
                                <th>Location</th>
                                <th>Status</th>
                                <th>Assigned Worker</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredComplaints.map(c => (
                                <tr key={c._id}>
                                    <td>
                                        <div className="mb-1"><strong>{c.type}</strong></div>
                                        <small className="text-muted">{c.description || 'No description provided'}</small>
                                    </td>
                                    <td><i className="fas fa-map-marker-alt text-danger me-2"></i>{c.area}</td>
                                    <td>
                                        <span className={`badge bg-${c.status === 'Resolved' ? 'success' : c.status === 'In Process' ? 'info' : 'warning'}`}>
                                            {c.status}
                                        </span>
                                    </td>
                                    <td>
                                        {c.assignedWorker ? (
                                            <div className="d-flex align-items-center">
                                                <i className="fas fa-user-check text-success me-2"></i>
                                                <small>{c.assignedWorker}</small>
                                            </div>
                                        ) : (
                                            <select 
                                                className="form-select form-select-sm" 
                                                onChange={(e) => handleAssignWorker(c._id, e.target.value)}
                                                defaultValue=""
                                            >
                                                <option value="" disabled>Assign Worker</option>
                                                {workers.filter(w => w.status === 'Active').map(w => (
                                                    <option key={w._id} value={w.name}>{w.name}</option>
                                                ))}
                                            </select>
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

    if (sectionId === "tasks") {
        return (
            <div className="dashboard-card p-4">
                <h5 className="mb-4">Task Management</h5>
                <div className="row g-4">
                    {tasks.map(task => (
                        <div key={task._id} className="col-md-6 col-xl-4">
                            <div className="p-3 border rounded shadow-sm bg-white h-100 d-flex flex-column">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <span className={`badge bg-${task.priority === 'High' ? 'danger' : task.priority === 'Medium' ? 'warning' : 'info'}-subtle text-${task.priority === 'High' ? 'danger' : task.priority === 'Medium' ? 'warning' : 'info'}`}>
                                        {task.priority || 'Medium'}
                                    </span>
                                    <span className={`badge bg-${task.status === 'Completed' ? 'success' : task.status === 'In Progress' ? 'info' : 'secondary'}`}>
                                        {task.status}
                                    </span>
                                </div>
                                <h6 className="mb-2">{task.title}</h6>
                                <div className="small mb-3">Assigned to: <strong>{task.assignedTo}</strong></div>
                                
                                <div className="mt-auto pt-3 border-top">
                                    <div className="d-flex flex-column gap-2">
                                        <select 
                                            className="form-select form-select-sm" 
                                            defaultValue={task.status}
                                            onChange={(e) => handleUpdateTaskStatus(task._id, e.target.value)}
                                        >
                                            <option>Pending</option>
                                            <option>In Progress</option>
                                            <option>Completed</option>
                                        </select>
                                        {task.status === 'Completed' && (
                                            <div className="mt-2 p-2 bg-light rounded border border-dashed">
                                                <label className="small text-muted d-block mb-1">Upload Completion Image</label>
                                                <input type="file" className="form-control form-control-sm" accept="image/*" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return null;
}
