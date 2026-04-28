import React, { useState, useEffect } from "react";
import api from "../../../utils/api";
import { toast } from "react-toastify";

const ManageTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const res = await api.get("/tasks");
            setTasks(res.data.tasks);
        } catch (err) {
            console.error("Error fetching tasks:", err);
        } finally {
            setLoading(false);
        }
    };

    const updateTaskStatus = async (id, status) => {
        try {
            const res = await api.patch(`/tasks/${id}`, { status });
            if (res.data.success) {
                fetchTasks();
            }
        } catch (err) {
            toast.error("Failed to update task status.");
        }
    };

    const handleProofUpload = async (id, e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const formData = new FormData();
                formData.append("proof", file);
                const res = await api.patch(`/tasks/${id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                if (res.data.success) {
                    toast.success('Proof uploaded — task completed!');
                    fetchTasks();
                }
            } catch (err) {
                toast.error("Failed to upload proof.");
            }
        }
    };

    return (
        <div className="dashboard-section-wrap p-4">
            <header className="mb-4">
                <h2 className="fw-bold">Task Management</h2>
                <p className="text-muted">Monitor and update progress of assigned cleanup tasks.</p>
            </header>

            <div className="dashboard-card p-0 overflow-hidden shadow-sm border-0 bg-white">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th className="ps-4">Task Title</th>
                                <th>Assigned Worker</th>
                                <th>Deadline</th>
                                <th>Workers Present</th>
                                <th>Status</th>
                                <th className="text-end pe-4">Actions / Proof</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5} className="text-center py-5">Loading tasks...</td></tr>
                            ) : tasks.length === 0 ? (
                                <tr><td colSpan={5} className="text-center py-5 text-muted">No tasks found.</td></tr>
                            ) : (
                                tasks.map((task) => (
                                    <tr key={task._id}>
                                        <td className="ps-4 fw-bold">{task.title}</td>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                <img src={task.workerPhoto || `https://ui-avatars.com/api/?name=${task.assignedTo || "Worker"}`} alt="Worker" className="rounded-circle" style={{ width: '30px', height: '30px' }} />
                                                <span>{task.assignedTo || "Unassigned"}</span>
                                            </div>
                                        </td>
                                        <td>{task.deadline || "N/A"}</td>
                                        <td className="text-center">
                                            <span className="badge bg-info">{task.workersCount || 1}</span>
                                        </td>
                                        <td>
                                            <span className={`badge ${task.status === 'Completed' || task.status === 'Resolved' ? 'bg-success' : task.status === 'In Progress' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                                                {task.status}
                                            </span>
                                        </td>
                                        <td className="text-end pe-4">
                                            <div className="d-flex gap-2 justify-content-end align-items-center">
                                                {task.status !== 'Completed' && task.status !== 'Resolved' ? (
                                                    <>
                                                        <select 
                                                            className="form-select form-select-sm w-auto"
                                                            value={task.status}
                                                            onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                                                        >
                                                            <option value="Pending">Pending</option>
                                                            <option value="In Progress">In Progress</option>
                                                            <option value="Completed">Completed</option>
                                                        </select>
                                                        {task.status === 'In Progress' && (
                                                            <div className="position-relative">
                                                                <button className="btn btn-sm btn-outline-success">
                                                                    <i className="fas fa-upload me-1"></i> Proof
                                                                </button>
                                                                <input 
                                                                    type="file" 
                                                                    className="position-absolute top-0 start-0 opacity-0 w-100 h-100" 
                                                                    style={{ cursor: 'pointer' }}
                                                                    onChange={(e) => handleProofUpload(task._id, e)}
                                                                />
                                                            </div>
                                                        )}
                                                    </>
                                                ) : (
                                                    <div className="d-flex align-items-center gap-2">
                                                        {task.proofImage && (
                                                            <img src={`http://localhost:4000${task.proofImage}`} alt="Proof" className="rounded border" style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
                                                        )}
                                                        <span className="text-success small fw-bold">Verified</span>
                                                    </div>
                                                )}
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

export default ManageTasks;