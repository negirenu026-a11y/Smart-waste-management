import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import api from '../../../utils/api';

const AdminDashboard = () => {
    const { user } = useOutletContext();
    const accentColor = "#10b981";
    const [counts, setCounts] = useState({ mcs: 0, citizens: 0, complaints: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const [usersRes, complaintsRes] = await Promise.all([
                    api.get("/users"),
                    api.get("/complaints")
                ]);
                const users = usersRes.data.users || [];
                setCounts({
                    mcs: users.filter(u => u.role === 'mc' || u.userType === 'mc').length,
                    citizens: users.filter(u => u.role === 'citizen' || u.userType === 'citizen').length,
                    complaints: (complaintsRes.data.complaints || []).length
                });
            } catch (err) {
                console.error("Failed to fetch metrics", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMetrics();
    }, []);

    const metrics = [
        { label: "Registered MCs", value: counts.mcs, icon: "fa-building" },
        { label: "Active Citizens", value: counts.citizens, icon: "fa-users" },
        { label: "Total Complaints", value: counts.complaints, icon: "fa-file-invoice" }
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
