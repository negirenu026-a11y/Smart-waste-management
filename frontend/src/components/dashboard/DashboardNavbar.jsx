import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const DashboardNavbar = ({ user }) => {
    const [showNotif, setShowNotif] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const navigate = useNavigate();
    const accentColor = "#10b981";
    const userMenuRef = useRef(null);

    const [notifications, setNotifications] = useState([
        { id: 1, title: "New Complaint filed in Zone A", time: "5 mins ago" },
        { id: 2, title: "Worker Rajesh is now On Duty", time: "12 mins ago" },
        { id: 3, title: "System Maintenance at 12 AM", time: "1 hour ago" },
    ]);

    const clearNotification = (id) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const clearAll = () => {
        setNotifications([]);
    };

    const handleLogout = async () => {
        try {
            await api.post("/logout");
        } catch (err) {
            console.error("Logout API failed", err);
        } finally {
            localStorage.removeItem("wastewise-user");
            navigate("/auth", { replace: true });
        }
    };

    // Close user menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
                setShowUserMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="dashboard-topbar">
            <div className="dashboard-topbar__left">
                <div className="search-bar">
                    <i className="fas fa-search" />
                    <input type="text" placeholder="Search areas, complaints, workers..." />
                </div>
            </div>
            <div className="dashboard-topbar__right">
                <div className="position-relative d-flex align-items-center gap-3">
                    {/* Notification Button */}
                    <div className="position-relative">
                        <button className="dashboard-icon-button" onClick={() => setShowNotif(!showNotif)}>
                            <i className="fas fa-bell" />
                            {notifications.length > 0 && <span className="dashboard-icon-button__badge">{notifications.length}</span>}
                        </button>
                        {showNotif && (
                            <div className="dashboard-notif-dropdown shadow">
                                <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
                                    <h6 className="m-0 fw-bold">Recent Updates</h6>
                                    <div className="d-flex gap-2">
                                        {notifications.length > 0 && (
                                            <button className="btn btn-link btn-sm p-0 text-danger text-decoration-none small" onClick={clearAll}>Clear all</button>
                                        )}
                                        <button className="btn btn-link btn-sm p-0 text-decoration-none" onClick={() => setShowNotif(false)}>Close</button>
                                    </div>
                                </div>
                                <div className="notif-list">
                                    {notifications.length === 0 ? (
                                        <div className="p-4 text-center text-muted small">No new notifications</div>
                                    ) : (
                                        notifications.map((n) => (
                                            <div key={n.id} className="notif-item p-3 border-bottom hover-bg-light position-relative">
                                                <div className="d-flex gap-2 pe-4">
                                                    <i className="fas fa-info-circle text-primary mt-1" />
                                                    <div>
                                                        <p className="mb-0 small fw-bold">{n.title}</p>
                                                        <span className="text-muted" style={{ fontSize: "0.7rem" }}>{n.time}</span>
                                                    </div>
                                                </div>
                                                <button 
                                                    className="btn btn-sm position-absolute top-50 end-0 translate-middle-y me-2 text-muted border-0 bg-transparent"
                                                    onClick={() => clearNotification(n.id)}
                                                    title="Clear notification"
                                                >
                                                    <i className="fas fa-times small" />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* User Avatar with Dropdown */}
                <div className="dashboard-topbar__user ms-3 position-relative" ref={userMenuRef}>
                    <div
                        className="d-flex align-items-center gap-2"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setShowUserMenu(!showUserMenu)}
                    >
                        <div className="dashboard-topbar__avatar" style={{ background: accentColor }}>
                            {(user?.fullName || user?.name || "U")[0].toUpperCase()}
                        </div>
                        <div className="dashboard-topbar__user-info">
                            <span className="dashboard-topbar__user-name">{user?.fullName || user?.name || "User"}</span>
                            <span className="dashboard-topbar__user-role">{user?.role || "Citizen"}</span>
                        </div>
                        <i className={`fas fa-chevron-${showUserMenu ? 'up' : 'down'} ms-1`} style={{ fontSize: '0.7rem', color: '#888' }} />
                    </div>

                    {showUserMenu && (
                        <div className="dashboard-user-dropdown shadow" style={{
                            position: 'absolute',
                            top: '100%',
                            right: 0,
                            marginTop: '8px',
                            background: 'var(--card-bg)',
                            borderRadius: '10px',
                            minWidth: '180px',
                            zIndex: 1000,
                            overflow: 'hidden',
                            border: '1px solid var(--border-color)',
                            color: 'var(--text-main)'
                        }}>
                            <button
                                className="d-flex align-items-center gap-2 w-100 border-0 bg-transparent px-4 py-3 text-start"
                                style={{ fontSize: '0.9rem', color: 'inherit' }}
                                onClick={() => {
                                    setShowUserMenu(false);
                                    navigate(`/${user?.role || 'citizen'}/settings`);
                                }}
                                onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-main)'}
                                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <i className="fas fa-cog" style={{ color: accentColor }} />
                                <span>Settings</span>
                            </button>
                            <hr className="m-0 opacity-10" />

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardNavbar;
