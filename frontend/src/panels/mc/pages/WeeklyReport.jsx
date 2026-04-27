import React, { useState, useEffect } from "react";

const WeeklyReport = () => {
    const [stats, setStats] = useState({
        workers: 0,
        tasks: 0,
        complaints: 0,
        resolvedTasks: 0,
        resolvedComplaints: 0
    });

    useEffect(() => {
        const workers = JSON.parse(localStorage.getItem('mc_workers') || '[]');
        const tasks = JSON.parse(localStorage.getItem('mc_tasks') || '[]');
        const complaints = JSON.parse(localStorage.getItem('mc_complaints') || '[]');

        setStats({
            workers: workers.length,
            tasks: tasks.length,
            complaints: complaints.length,
            resolvedTasks: tasks.filter(t => t.status === 'Resolved').length,
            resolvedComplaints: complaints.filter(c => c.status === 'Resolved').length
        });
    }, []);

    return (
        <div className="dashboard-section-wrap">
            <header className="mb-4">
                <h2 className="fw-bold">Weekly Performance Report</h2>
                <p className="text-muted">Consolidated overview of municipal operations and efficiency.</p>
            </header>

            <div className="row g-4 mb-5">
                <div className="col-md-4">
                    <div className="dashboard-card text-center p-4">
                        <div className="display-4 fw-bold text-success mb-2">{stats.workers}</div>
                        <h6 className="text-muted text-uppercase small fw-bold">Field Workforce</h6>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="dashboard-card text-center p-4">
                        <div className="display-4 fw-bold text-primary mb-2">{stats.tasks}</div>
                        <h6 className="text-muted text-uppercase small fw-bold">Total Tasks Created</h6>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="dashboard-card text-center p-4">
                        <div className="display-4 fw-bold text-warning mb-2">{stats.complaints}</div>
                        <h6 className="text-muted text-uppercase small fw-bold">Total Complaints Received</h6>
                    </div>
                </div>
            </div>

            <div className="dashboard-card">
                <h5 className="fw-bold mb-4">Efficiency Breakdown</h5>
                <div className="table-responsive">
                    <table className="table table-bordered align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Category</th>
                                <th>Total Count</th>
                                <th>Resolved / Completed</th>
                                <th>Efficiency (%)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="fw-bold">Public Complaints</td>
                                <td>{stats.complaints}</td>
                                <td>{stats.resolvedComplaints}</td>
                                <td>
                                    {stats.complaints > 0 
                                        ? Math.round((stats.resolvedComplaints / stats.complaints) * 100) 
                                        : 0}%
                                </td>
                            </tr>
                            <tr>
                                <td className="fw-bold">Maintenance Tasks</td>
                                <td>{stats.tasks}</td>
                                <td>{stats.resolvedTasks}</td>
                                <td>
                                    {stats.tasks > 0 
                                        ? Math.round((stats.resolvedTasks / stats.tasks) * 100) 
                                        : 0}%
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-4 p-4 bg-light rounded-3">
                <h6 className="fw-bold mb-2">Note:</h6>
                <p className="small text-muted mb-0">This report is generated based on real-time data from your municipal operational logs. Data is persistent across sessions via local storage.</p>
            </div>
        </div>
    );
};

export default WeeklyReport;
