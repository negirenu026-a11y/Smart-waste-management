import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { cities, zones } from '../../../utils/dashboardData';
import api from '../../../utils/api';
import { useOutletContext } from 'react-router-dom';

const Register = () => {
    const { user } = useOutletContext();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        city: '',
        zone: '',
        ward: '',
        location: '',
        phone: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.fullName || user.name || '',
                email: user.email || '',
                city: user.city || '',
                zone: user.zone || '',
                ward: user.ward || '',
                location: user.location || '',
                phone: user.phone || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.patch("/profile", formData);
            if (res.data.success) {
                toast.success('Registration details updated successfully!');
                // Update local storage to reflect changes in UI immediately
                localStorage.setItem("wastewise-user", JSON.stringify(res.data.user));
            }
        } catch (err) {
            toast.error("Failed to update registration details.");
        }
    };

    return (
        <div className="dashboard-section-wrap p-4">
            <header className="mb-4">
                <h2 className="fw-bold">Register Itself</h2>
                <p className="text-muted">Update your personal and residential details to help us serve you better.</p>
            </header>

            <div className="dashboard-card p-4 shadow-sm border-0 bg-white">
                <form onSubmit={handleSubmit} className="row g-4">
                    <div className="col-md-6">
                        <label className="form-label fw-bold small text-uppercase">Full Name</label>
                        <input 
                            type="text" 
                            name="name"
                            className="form-control p-3 bg-light border-0" 
                            placeholder="Enter your full name" 
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-bold small text-uppercase">Email Address (Read-only)</label>
                        <input 
                            type="email" 
                            name="email"
                            className="form-control p-3 bg-light border-0" 
                            value={formData.email}
                            readOnly
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-bold small text-uppercase">Phone Number</label>
                        <input 
                            type="text" 
                            name="phone"
                            className="form-control p-3 bg-light border-0" 
                            placeholder="Phone number" 
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-bold small text-uppercase">City</label>
                        <select 
                            name="city"
                            className="form-select p-3 bg-light border-0" 
                            value={formData.city}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select City</option>
                            {cities.map(city => <option key={city} value={city}>{city}</option>)}
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-bold small text-uppercase">Zone</label>
                        <select 
                            name="zone"
                            className="form-select p-3 bg-light border-0" 
                            value={formData.zone}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Zone</option>
                            {zones.map(zone => <option key={zone} value={zone}>{zone}</option>)}
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-bold small text-uppercase">Ward Number</label>
                        <input 
                            type="text" 
                            name="ward"
                            className="form-control p-3 bg-light border-0" 
                            placeholder="e.g. Ward 12" 
                            value={formData.ward}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-12">
                        <label className="form-label fw-bold small text-uppercase">Specific Location</label>
                        <input 
                            type="text" 
                            name="location"
                            className="form-control p-3 bg-light border-0" 
                            placeholder="e.g. Near Community Center" 
                            value={formData.location}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-12 mt-5 text-end">
                        <button type="submit" className="btn btn-primary px-5 py-3 shadow-sm fw-bold">
                            Update Registration Data
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
