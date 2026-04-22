import React, { useState } from 'react';

export function SettingsModule({ savedUser }) {
    const [theme, setTheme] = useState('light');
    const [language, setLanguage] = useState('English');
    const [notifications, setNotifications] = useState(true);

    return (
        <div className="settings-container">
            <div className="dashboard-hero dashboard-hero--pro mb-4">
                <span className="tag">Control Center</span>
                <h3>System Settings</h3>
                <p>Manage your account preferences, security, and notification settings.</p>
            </div>

            <div className="row g-4">
                <div className="col-lg-6">
                    <div className="dashboard-card p-4 h-100">
                        <h5 className="mb-4"><i className="fas fa-user-cog me-2 text-primary"></i>Profile Settings</h5>
                        <form onSubmit={(e) => { e.preventDefault(); alert('Profile updated!'); }}>
                            <div className="mb-3">
                                <label className="form-label small font-weight-bold">Full Name</label>
                                <input className="form-control" defaultValue={savedUser.fullName} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label small font-weight-bold">Contact Details</label>
                                <input className="form-control" defaultValue={savedUser.email} />
                            </div>
                            <div className="mb-4">
                                <label className="form-label small font-weight-bold">Profile Photo</label>
                                <div className="d-flex align-items-center">
                                    <div className="avatar-sm bg-primary text-white rounded-circle me-3" style={{width: 50, height: 50, fontSize: '1.5rem'}}>
                                        {savedUser.fullName?.charAt(0)}
                                    </div>
                                    <button type="button" className="btn btn-sm btn-outline-secondary">Change Photo</button>
                                </div>
                            </div>
                            <button type="submit" className="button button--primary button--sm">Update Profile</button>
                        </form>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="dashboard-card p-4 h-100">
                        <h5 className="mb-4"><i className="fas fa-shield-alt me-2 text-primary"></i>Password & Security</h5>
                        <form onSubmit={(e) => { e.preventDefault(); alert('Security settings updated!'); }}>
                            <div className="mb-3">
                                <label className="form-label small font-weight-bold">Current Password</label>
                                <input type="password" name="oldPassword" className="form-control" placeholder="••••••••" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label small font-weight-bold">New Password</label>
                                <input type="password" name="newPassword" className="form-control" placeholder="Min 8 characters" />
                            </div>
                            <div className="mb-4">
                                <label className="form-label small font-weight-bold">Confirm New Password</label>
                                <input type="password" name="confirmPassword" className="form-control" />
                            </div>
                            <button type="submit" className="button button--primary button--sm">Change Password</button>
                        </form>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="dashboard-card p-4 h-100">
                        <h5 className="mb-4"><i className="fas fa-adjust me-2 text-primary"></i>Core Features</h5>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h6 className="mb-0">Theme Mode</h6>
                                <p className="text-muted small mb-0">Switch between light and dark themes</p>
                            </div>
                            <div className="btn-group btn-group-sm">
                                <button className={`btn btn-outline-secondary ${theme === 'light' ? 'active' : ''}`} onClick={() => setTheme('light')}>Light</button>
                                <button className={`btn btn-outline-secondary ${theme === 'dark' ? 'active' : ''}`} onClick={() => setTheme('dark')}>Dark</button>
                            </div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 className="mb-0">Language Preference</h6>
                                <p className="text-muted small mb-0">Select your preferred language</p>
                            </div>
                            <select className="form-select form-select-sm w-auto" value={language} onChange={(e) => setLanguage(e.target.value)}>
                                <option>English</option>
                                <option>Hindi</option>
                                <option>Spanish</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="dashboard-card p-4 h-100">
                        <h5 className="mb-4"><i className="fas fa-bell me-2 text-primary"></i>Notifications & Privacy</h5>
                        <div className="form-check form-switch mb-3">
                            <input className="form-check-input" type="checkbox" checked={notifications} onChange={() => setNotifications(!notifications)} />
                            <label className="form-check-label">Enable desktop notifications</label>
                        </div>
                        <div className="form-check form-switch mb-3">
                            <input className="form-check-input" type="checkbox" defaultChecked />
                            <label className="form-check-label">Public profile visibility</label>
                        </div>
                        <div className="form-check form-switch">
                            <input className="form-check-input" type="checkbox" defaultChecked />
                            <label className="form-check-label">Sound alerts for new complaints</label>
                        </div>
                    </div>
                </div>

                <div className="col-12">
                    <div className="dashboard-card p-4">
                        <h5 className="mb-3"><i className="fas fa-question-circle me-2 text-primary"></i>Help & Support</h5>
                        <div className="row">
                            <div className="col-md-4">
                                <div className="p-3 bg-light rounded text-center">
                                    <i className="fas fa-book fa-2x mb-2 opacity-50"></i>
                                    <h6>Read Documentation</h6>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="p-3 bg-light rounded text-center">
                                    <i className="fas fa-envelope fa-2x mb-2 opacity-50"></i>
                                    <h6>Contact Support</h6>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="p-3 bg-light rounded text-center">
                                    <i className="fas fa-info-circle fa-2x mb-2 opacity-50"></i>
                                    <h6>System Status</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
