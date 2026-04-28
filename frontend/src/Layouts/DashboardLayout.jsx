import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import DashboardNavbar from '../components/dashboard/DashboardNavbar';
import './DashboardLayout.css';

const DashboardLayout = ({ role }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("wastewise-user");

        if (!storedUser) {
            navigate("/auth", { replace: true });
            return;
        }

        try {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser.role !== role && role !== 'any') {
                // If user role doesn't match the required role for this layout
                // We could redirect to their specific dashboard here if we want
            }
            setUser(parsedUser);
        } catch (error) {
            navigate("/auth", { replace: true });
        } finally {
            setLoading(false);
        }
    }, [role, navigate]);

    if (loading) return <div className="dashboard-loading">Loading...</div>;

    return (
        <div className="dashboard-shell">
            <DashboardSidebar role={user?.role || role} />
            <main className="dashboard-main">
                <div className="welcome-marquee">
                    <marquee scrollamount="5">
                        ♻️ Welcome to WasteWise Management Platform — Working towards a cleaner and greener environment ♻️
                    </marquee>
                </div>
                <DashboardNavbar user={user} />
                <div className="dashboard-content">
                    <Outlet context={{ user }} />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
