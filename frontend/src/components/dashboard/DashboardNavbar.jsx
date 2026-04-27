import React, { useState } from 'react';

const DashboardNavbar = ({ user }) => {
    const [showNotif, setShowNotif] = useState(false);
    const accentColor = "#10b981";

    const notifications = [
        { title: "New Complaint filed in Zone A", time: "5 mins ago" },
        { title: "Worker Rajesh is now On Duty", time: "12 mins ago" },
        { title: "System Maintenance at 12 AM", time: "1 hour ago" },
    ];

    return (
        <div className="dashboard-topbar">
            <div className="dashboard-topbar__left">
                <div className="search-bar">
                    <i className="fas fa-search" />
                    <input type="text" placeholder="Search areas, complaints, workers..." />
                </div>
            </div>
            <div className="dashboard-topbar__right">
                <div className="position-relative">
                    <button className="dashboard-icon-button" onClick={() => setShowNotif(!showNotif)}>
                        <i className="fas fa-bell" />
                        {notifications.length > 0 && <span className="dashboard-icon-button__badge">{notifications.length}</span>}
                    </button>
                    {showNotif && (
                        <div className="dashboard-notif-dropdown shadow">
                            <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
                                <h6 className="m-0 fw-bold">Recent Updates</h6>
                                <button className="btn btn-link btn-sm p-0 text-decoration-none" onClick={() => setShowNotif(false)}>Close</button>
                            </div>
                            <div className="notif-list">
                                {notifications.map((n, i) => (
                                    <div key={i} className="notif-item p-3 border-bottom hover-bg-light">
                                        <div className="d-flex gap-2">
                                            <i className="fas fa-info-circle text-primary mt-1" />
                                            <div>
                                                <p className="mb-0 small fw-bold">{n.title}</p>
                                                <span className="text-muted" style={{ fontSize: "0.7rem" }}>{n.time}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className="dashboard-topbar__user ms-3">
                    <div className="dashboard-topbar__avatar" style={{ background: accentColor }}>
                        {(user?.fullName || user?.name || "U")[0].toUpperCase()}
                    </div>
                    <div className="dashboard-topbar__user-info">
                        <span className="dashboard-topbar__user-name">{user?.fullName || user?.name || "User"}</span>
                        <span className="dashboard-topbar__user-role">{user?.role || "Citizen"}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardNavbar;
