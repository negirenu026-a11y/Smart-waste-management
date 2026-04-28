import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const DashboardNavbar = ({ user }) => {
    const [showNotif, setShowNotif] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const navigate = useNavigate();
    const accentColor = "#10b981";
    const userMenuRef = useRef(null);

    const notifications = [
        { title: "New Complaint filed in Zone A", time: "5 mins ago" },
        { title: "Worker Rajesh is now On Duty", time: "12 mins ago" },
        { title: "System Maintenance at 12 AM", time: "1 hour ago" },
    ];

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
                            background: '#fff',
                            borderRadius: '10px',
                            minWidth: '180px',
                            zIndex: 1000,
                            overflow: 'hidden',
                            border: '1px solid #eee'
                        }}>
                            <button
                                className="d-flex align-items-center gap-2 w-100 border-0 bg-transparent px-4 py-3 text-start"
                                style={{ fontSize: '0.9rem' }}
                                onClick={() => {
                                    setShowUserMenu(false);
                                    navigate(`/${user?.role || 'citizen'}/settings`);
                                }}
                                onMouseOver={(e) => e.currentTarget.style.background = '#f8f9fa'}
                                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <i className="fas fa-cog" style={{ color: accentColor }} />
                                <span>Settings</span>
                            </button>
                            <hr className="m-0" />

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardNavbar;
