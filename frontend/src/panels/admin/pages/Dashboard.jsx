import React from 'react';
import { useOutletContext } from 'react-router-dom';

const AdminDashboard = () => {
    const { user } = useOutletContext();
    const accentColor = "#10b981";

    const metrics = [
        { label: "Registered MCs", value: "24", icon: "fa-building" },
        { label: "Active Citizens", value: "1,540", icon: "fa-users" },
        { label: "High Priority Alerts", value: "8", icon: "fa-exclamation-triangle" },
        { label: "Total Complaints", value: "450", icon: "fa-file-invoice" }
    ];

    return (
        <div className="dashboard-section-wrap">
            <header className="mb-4">
                <h2 className="fw-bold">System Overview</h2>
                <p className="text-muted">Central monitoring and management for waste operations.</p>
            </header>

            <div className="dashboard-metrics mb-4">
                {metrics.map((m, i) => (
                    <div key={i} className="dashboard-card dashboard-card--metric hover-lift">
                        <div className="dashboard-card__metric-top">
                            <span className="dashboard-card__metric-icon" style={{ background: `${accentColor}15`, color: accentColor }}>
                                <i className={`fas ${m.icon}`} />
                            </span>
                            <span className="dashboard-card__metric-label text-uppercase small fw-bold">{m.label}</span>
                        </div>
                        <strong className="dashboard-card__metric-value mt-2">{m.value}</strong>
                    </div>
                ))}
            </div>

            <div className="row">
                <div className="col-md-12">
                    <div className="dashboard-card p-5 text-center bg-white">
                        <div className="mb-4">
                            <i className="fas fa-chart-pie fa-4x" style={{ color: accentColor }}></i>
                        </div>
                        <h4 className="fw-bold">Administrator Control Panel</h4>
                        <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
                            You are logged in as the System Administrator. From here, you can manage Municipal Corporations, 
                            oversee regional zones, and monitor the overall efficiency of the waste management system.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
