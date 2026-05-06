import React, { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import api from "../../../utils/api";

const McDashboard = () => {
    const { user } = useOutletContext();
    const navigate = useNavigate();
    
    const [stats, setStats] = useState({
        workers: 0,
        tasks: 0,
        complaints: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const [workersRes, tasksRes, complaintsRes] = await Promise.all([
                    api.get("/workers"),
                    api.get("/tasks"),
                    api.get("/complaints")
                ]);
                const workers = workersRes.data.workers || [];
                const tasks = tasksRes.data.tasks || [];
                const complaints = complaintsRes.data.complaints || [];

                setStats({
                    workers: workers.length,
                    tasks: tasks.filter(t => t.status !== 'Resolved' && t.status !== 'Completed').length,
                    complaints: complaints.filter(c => c.status !== 'Resolved').length
                });
            } catch (err) {
                console.error("Failed to fetch dashboard stats", err);
                setStats({ workers: 0, tasks: 0, complaints: 0 });
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const quickActions = [
        { label: "Register New Worker", icon: "fa-user-plus", color: "#10b981", path: "/mc/manage-workers" },
        { label: "Create Maintenance Task", icon: "fa-tasks", color: "#3b82f6", path: "/mc/tasks" },
        { label: "Generate Weekly Report", icon: "fa-chart-bar", color: "#f59e0b", path: "/mc/reports" }
    ];

    return (
        <div className="dashboard-section-wrap">
            <header className="mb-4">
                <h2 className="fw-bold">Operations Overview</h2>
                <p className="text-muted">Welcome back, {user?.name}. Here's the current state of your zone.</p>
            </header>

            <div className="dashboard-metrics mb-5">
                <div className="dashboard-card dashboard-card--metric">
                    <div className="dashboard-card__metric-top">
                        <span className="dashboard-card__metric-icon" style={{ background: '#10b98115', color: '#10b981' }}>
                            <i className="fas fa-hard-hat"></i>
                        </span>
                        <span className="dashboard-card__metric-label">Active Workforce</span>
                    </div>
                    <strong className="dashboard-card__metric-value">{stats.workers}</strong>
                </div>
                <div className="dashboard-card dashboard-card--metric">
                    <div className="dashboard-card__metric-top">
                        <span className="dashboard-card__metric-icon" style={{ background: '#3b82f615', color: '#3b82f6' }}>
                            <i className="fas fa-clipboard-list"></i>
                        </span>
                        <span className="dashboard-card__metric-label">Active Tasks</span>
                    </div>
                    <strong className="dashboard-card__metric-value">{stats.tasks}</strong>
                </div>
                <div className="dashboard-card dashboard-card--metric">
                    <div className="dashboard-card__metric-top">
                        <span className="dashboard-card__metric-icon" style={{ background: '#ef444415', color: '#ef4444' }}>
                            <i className="fas fa-exclamation-triangle"></i>
                        </span>
                        <span className="dashboard-card__metric-label">Pending Complaints</span>
                    </div>
                    <strong className="dashboard-card__metric-value">{stats.complaints}</strong>
                </div>
            </div>

            <div className="row g-4 mt-2">
                <div className="col-lg-8">
                    <h5 className="fw-bold mb-3">Operational Queue</h5>
                    <div className="dashboard-card p-0 overflow-hidden shadow-sm border-0 bg-white">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th className="ps-4 small fw-bold">Recent Item</th>
                                        <th className="small fw-bold">Status</th>
                                        <th className="pe-4 text-end small fw-bold">Priority</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.complaints === 0 && stats.tasks === 0 ? (
                                        <tr><td colSpan={3} className="text-center py-5 text-muted small">No recent activity found.</td></tr>
                                    ) : (
                                        <>
                                            {/* We can show a few recent items here if we had the full arrays, 
                                                but to keep it simple and safe, we'll show a summary message or fetch more */}
                                            <tr>
                                                <td className="ps-4">
                                                    <div className="small fw-bold">Pending Reports</div>
                                                    <div className="text-muted" style={{fontSize: '0.7rem'}}>New issues requiring attention</div>
                                                </td>
                                                <td><span className="badge bg-danger bg-opacity-10 text-danger border">Awaiting Action</span></td>
                                                <td className="pe-4 text-end"><span className="badge bg-danger">{stats.complaints} Open</span></td>
                                            </tr>
                                            <tr>
                                                <td className="ps-4">
                                                    <div className="small fw-bold">Cleanup Tasks</div>
                                                    <div className="text-muted" style={{fontSize: '0.7rem'}}>Ongoing field operations</div>
                                                </td>
                                                <td><span className="badge bg-warning bg-opacity-10 text-warning border">In Progress</span></td>
                                                <td className="pe-4 text-end"><span className="badge bg-warning text-dark">{stats.tasks} Active</span></td>
                                            </tr>
                                        </>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4">
                    <h5 className="fw-bold mb-3">Quick Actions</h5>
                    <div className="d-grid gap-3">
                        {quickActions.map((action, index) => (
                            <div 
                                key={index}
                                className="dashboard-card p-3 d-flex align-items-center gap-3 hover-lift shadow-sm border-0 bg-white" 
                                style={{ cursor: 'pointer', borderLeft: `4px solid ${action.color}` }}
                                onClick={() => navigate(action.path)}
                            >
                                <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: 40, height: 40, background: `${action.color}15`, color: action.color }}>
                                    <i className={`fas ${action.icon}`}></i>
                                </div>
                                <h6 className="fw-bold m-0 small">{action.label}</h6>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default McDashboard;