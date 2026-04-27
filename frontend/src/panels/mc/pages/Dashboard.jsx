import React, { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

const McDashboard = () => {
    const { user } = useOutletContext();
    const navigate = useNavigate();
    
    const [stats, setStats] = useState({
        workers: 0,
        tasks: 0,
        complaints: 0
    });

    useEffect(() => {
        // Load counts from localStorage
        const workers = JSON.parse(localStorage.getItem('mc_workers') || '[]');
        const tasks = JSON.parse(localStorage.getItem('mc_tasks') || '[]');
        const complaints = JSON.parse(localStorage.getItem('mc_complaints') || '[]');
        
        setStats({
            workers: workers.length,
            tasks: tasks.filter(t => t.status !== 'Resolved').length,
            complaints: complaints.filter(c => c.status !== 'Resolved').length
        });
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

            <h5 className="fw-bold mb-3">Quick Actions</h5>
            <div className="row g-4">
                {quickActions.map((action, index) => (
                    <div key={index} className="col-md-4">
                        <div 
                            className="dashboard-card p-4 text-center hover-lift" 
                            style={{ cursor: 'pointer', borderTop: `4px solid ${action.color}` }}
                            onClick={() => navigate(action.path)}
                        >
                            <i className={`fas ${action.icon} fa-2x mb-3`} style={{ color: action.color }}></i>
                            <h6 className="fw-bold m-0">{action.label}</h6>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default McDashboard;