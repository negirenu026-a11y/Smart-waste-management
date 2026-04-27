import React, { useState, useEffect } from "react";
import { initialTasks } from "../../../utils/dashboardData";

const ManageTasks = () => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        // Read from the same key used by MC panel
        const saved = JSON.parse(localStorage.getItem('mc_tasks') || '[]');
        if (saved.length > 0) {
            setTasks(saved);
        } else {
            setTasks(initialTasks);
        }
    }, []);

    return (
        <div className="dashboard-section-wrap p-4">
            <header className="mb-4">
                <h2 className="fw-bold">Global Task Oversight</h2>
                <p className="text-muted">Review all tasks across all zones and municipal corporations.</p>
            </header>

            <div className="dashboard-card p-0 overflow-hidden shadow-sm border-0 bg-white">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th className="ps-4">Task Details</th>
                                <th>Assigned Worker</th>
                                <th>Deadline</th>
                                <th>Status</th>
                                <th className="text-end pe-4">Evidence / Proof</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.length === 0 ? (
                                <tr><td colSpan={5} className="text-center py-5 text-muted">No tasks records found.</td></tr>
                            ) : (
                                tasks.map((task) => (
                                    <tr key={task.id}>
                                        <td className="ps-4">
                                            <p className="fw-bold mb-0">{task.title}</p>
                                            <span className="text-muted small">ID: #{task.id}</span>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                <img src={task.workerPhoto || `https://ui-avatars.com/api/?name=${task.assignedTo}`} alt="Worker" className="rounded-circle" style={{ width: '30px', height: '30px' }} />
                                                <span>{task.assignedTo}</span>
                                            </div>
                                        </td>
                                        <td>{task.deadline}</td>
                                        <td>
                                            <span className={`badge ${task.status === 'Completed' ? 'bg-success' : task.status === 'In Progress' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                                                {task.status}
                                            </span>
                                        </td>
                                        <td className="text-end pe-4">
                                            {task.proofImage ? (
                                                <div className="d-inline-block position-relative group" style={{ cursor: 'pointer' }} onClick={() => window.open(task.proofImage)}>
                                                    <img src={task.proofImage} alt="Proof" className="rounded shadow-sm border" style={{ width: '60px', height: '40px', objectFit: 'cover' }} />
                                                    <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-25 d-flex align-items-center justify-content-center opacity-0 hover-opacity-100 transition-all rounded">
                                                        <i className="fas fa-search-plus text-white"></i>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-muted italic small">No proof yet</span>
                                            )}
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