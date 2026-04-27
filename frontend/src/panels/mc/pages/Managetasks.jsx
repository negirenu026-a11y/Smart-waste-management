import React, { useState, useEffect } from "react";
import { initialTasks } from "../../../utils/dashboardData";

const ManageTasks = () => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('mc_tasks'));
        if (saved && saved.length > 0) {
            setTasks(saved);
        } else {
            setTasks(initialTasks.map(t => ({ ...t, workersCount: Math.floor(Math.random() * 5) + 1 })));
        }
    }, []);

    const updateTaskStatus = (id, status) => {
        const updated = tasks.map(t => t.id === id ? { ...t, status } : t);
        setTasks(updated);
        localStorage.setItem('mc_tasks', JSON.stringify(updated));
    };

    const handleProofUpload = (id, e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const updated = tasks.map(t => t.id === id ? { ...t, proofImage: reader.result, status: 'Completed' } : t);
                setTasks(updated);
                localStorage.setItem('mc_tasks', JSON.stringify(updated));
                alert('Proof image uploaded and task marked as Completed!');
            };
            reader.readAsDataURL(file);
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
                            {tasks.map((task) => (
                                <tr key={task.id}>
                                    <td className="ps-4 fw-bold">{task.title}</td>
                                    <td>
                                        <div className="d-flex align-items-center gap-2">
                                            <img src={task.workerPhoto || `https://ui-avatars.com/api/?name=${task.assignedTo}`} alt="Worker" className="rounded-circle" style={{ width: '30px', height: '30px' }} />
                                            <span>{task.assignedTo}</span>
                                        </div>
                                    </td>
                                    <td>{task.deadline}</td>
                                    <td className="text-center">
                                        <span className="badge bg-info">{task.workersCount || 3}</span>
                                    </td>
                                    <td>
                                        <span className={`badge ${task.status === 'Completed' ? 'bg-success' : task.status === 'In Progress' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                                            {task.status}
                                        </span>
                                    </td>
                                    <td className="text-end pe-4">
                                        <div className="d-flex gap-2 justify-content-end align-items-center">
                                            {task.status !== 'Completed' ? (
                                                <>
                                                    <select 
                                                        className="form-select form-select-sm w-auto"
                                                        value={task.status}
                                                        onChange={(e) => updateTaskStatus(task.id, e.target.value)}
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
                                                                onChange={(e) => handleProofUpload(task.id, e)}
                                                            />
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <div className="d-flex align-items-center gap-2">
                                                    {task.proofImage && (
                                                        <img src={task.proofImage} alt="Proof" className="rounded border" style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
                                                    )}
                                                    <span className="text-success small fw-bold">Verified</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageTasks;