import React, { useState, useEffect } from "react";
import api from "../../../utils/api";
import { toast } from "react-toastify";

const ManageTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        assignedTo: "",
        assignedToId: "",
        deadline: "",
        priority: "Medium",
        description: ""
    });

    useEffect(() => {
        fetchTasks();
        fetchWorkers();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const res = await api.get("/tasks");
            setTasks(res.data.tasks || []);
        } catch (err) {
            console.error("Error fetching tasks:", err);
        } finally {
            setLoading(false);
        }
    };

    const displayTasks = tasks;

    const fetchWorkers = async () => {
        try {
            const res = await api.get("/workers");
            setWorkers(res.data.workers || []);
        } catch (err) {
            console.error("Error fetching workers:", err);
        }
    };

    const handleWorkerChange = (e) => {
        const workerId = e.target.value;
        const worker = workers.find(w => w._id === workerId);
        setFormData({ 
            ...formData, 
            assignedToId: workerId, 
            assignedTo: worker ? worker.name : "" 
        });
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/tasks", formData);
            if (res.data.success) {
                toast.success("Task created and assigned!");
                setFormData({ title: "", assignedTo: "", assignedToId: "", deadline: "", priority: "Medium", description: "" });
                setShowForm(false);
                fetchTasks();
            }
        } catch (err) {
            toast.error("Failed to create task.");
        }
    };

    const updateTaskStatus = async (id, status) => {
        try {
            const res = await api.patch(`/tasks/${id}`, { status });
            if (res.data.success) {
                toast.success(`Task marked as ${status}`);
                fetchTasks();
            }
        } catch (err) {
            toast.error("Failed to update task status.");
        }
    };

    const deleteTask = async (id) => {
        if (!window.confirm("Are you sure you want to delete this task?")) return;
        try {
            const res = await api.delete(`/tasks/${id}`);
            if (res.data.success) {
                toast.success("Task removed.");
                fetchTasks();
            }
        } catch (err) {
            toast.error("Failed to delete task.");
        }
    };

    return (
        <div className="dashboard-section-wrap p-4">
            <header className="mb-4 d-flex justify-content-between align-items-center">
                <div>
                    <h2 className="fw-bold">Task Management</h2>
                    <p className="text-muted">Create, assign, and monitor cleanup operations.</p>
                </div>
                <button className="btn btn-primary px-4 shadow-sm" onClick={() => setShowForm(!showForm)}>
                    <i className={`fas ${showForm ? "fa-times" : "fa-plus"} me-2`}></i>
                    {showForm ? "Cancel" : "New Task"}
                </button>
            </header>

            {showForm && (
                <div className="dashboard-card mb-4 p-4 border-0 shadow-sm bg-white">
                    <h5 className="fw-bold mb-3">Create New Task</h5>
                    <form onSubmit={handleAddTask} className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label small fw-bold">Task Title</label>
                            <input type="text" name="title" className="form-control" placeholder="e.g. Clear overflow at Sector 4" value={formData.title} onChange={handleInputChange} required />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label small fw-bold">Assign Worker</label>
                            <select name="assignedToId" className="form-select" value={formData.assignedToId} onChange={handleWorkerChange} required>
                                <option value="">Select Worker</option>
                                {workers.map(w => <option key={w._id} value={w._id}>{w.name} ({w.role})</option>)}
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label small fw-bold">Deadline</label>
                            <input type="date" name="deadline" className="form-control" value={formData.deadline} onChange={handleInputChange} required />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label small fw-bold">Priority</label>
                            <select name="priority" className="form-select" value={formData.priority} onChange={handleInputChange}>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                        <div className="col-md-4 d-flex align-items-end">
                            <button type="submit" className="btn btn-success w-100 py-2 fw-bold">Create & Assign</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="dashboard-card p-0 overflow-hidden shadow-sm border-0 bg-white">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th className="ps-4">Task Title</th>
                                <th>Assigned To</th>
                                <th>Deadline</th>
                                <th>Priority</th>
                                <th>Status</th>
                                <th className="text-end pe-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={6} className="text-center py-5">Loading tasks...</td></tr>
                            ) : tasks.length === 0 && displayTasks.length === 0 ? (
                                <tr><td colSpan={6} className="text-center py-5 text-muted">No tasks assigned yet.</td></tr>
                            ) : (
                                displayTasks.map((task) => (
                                    <tr key={task._id}>
                                        <td className="ps-4 fw-bold text-primary">{task.title}</td>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="avatar-xs bg-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: 30, height: 30 }}>
                                                    <i className="fas fa-user-circle text-muted"></i>
                                                </div>
                                                <span>{task.assignedTo || "Unassigned"}</span>
                                            </div>
                                        </td>
                                        <td>{task.deadline || "Today"}</td>
                                        <td>
                                            <span className={`badge ${task.priority === 'High' ? 'bg-danger' : task.priority === 'Medium' ? 'bg-warning text-dark' : 'bg-info'}`}>
                                                {task.priority}
                                            </span>
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
                                                        <button className="btn btn-sm btn-outline-danger" onClick={() => deleteTask(task._id)}>
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    </>
                                                ) : (
                                                    <div className="d-flex align-items-center gap-2">
                                                        {task.completionProof && (
                                                            <img src={`http://localhost:4000${task.completionProof}`} alt="Proof" className="rounded border" style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
                                                        )}
                                                        <span className="text-success small fw-bold">Verified</span>
                                                        <button className="btn btn-sm btn-outline-danger ms-2" onClick={() => deleteTask(task._id)}>
                                                            <i className="fas fa-trash"></i>
                                                        </button>
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