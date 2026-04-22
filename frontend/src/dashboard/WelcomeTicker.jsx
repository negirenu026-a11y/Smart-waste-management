/* ════════════════════════════════════════════════════════════════════════
   WelcomeTicker — animated ticker banner shown at top of every dashboard
   ════════════════════════════════════════════════════════════════════════ */
import React, { useEffect, useState } from 'react';

const roleLabel = {
    admin: 'Administrator',
    mc: 'Municipal Corporation Officer',
    citizen: 'Citizen'
};

const roleIcon = {
    admin: 'fa-shield-alt',
    mc: 'fa-city',
    citizen: 'fa-user-circle'
};

const roleColor = {
    admin: '#c0392b',
    mc: '#1a73e8',
    citizen: '#27ae60'
};

export default function WelcomeTicker({ user }) {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const name = user?.fullName || user?.name || 'User';
    const role = user?.role || 'citizen';
    const label = roleLabel[role] || role;
    const icon = roleIcon[role] || 'fa-user';
    const color = roleColor[role] || '#f6ac3b';

    const greeting = () => {
        const h = time.getHours();
        if (h < 12) return 'Good Morning';
        if (h < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    const timeStr = time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const dateStr = time.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const tickerText = [
        `🌿 ${greeting()}, ${name}! Welcome to the WasteWise Management Platform.`,
        `🔐 You are logged in as: ${label}.`,
        `📅 Today is ${dateStr}.`,
        `♻️ Together we can build a cleaner, greener India.`,
        `📌 Report waste issues directly from your Citizen Panel.`,
        `🏙️ MC Officers: Manage workers and tasks from your dashboard.`,
        `🛡️ Admins: Full system oversight is available in your panel.`,
    ].join('   •••   ');

    return (
        <div className="welcome-ticker" style={{ '--ticker-color': color }}>
            <div className="welcome-ticker__badge">
                <i className={`fas ${icon}`}></i>
                <span>{label}</span>
            </div>
            <div className="welcome-ticker__track">
                <div className="welcome-ticker__content">
                    {tickerText}&nbsp;&nbsp;&nbsp;&nbsp;{tickerText}
                </div>
            </div>
            <div className="welcome-ticker__clock">
                <i className="fas fa-clock me-1"></i>
                {timeStr}
            </div>
        </div>
    );
}
