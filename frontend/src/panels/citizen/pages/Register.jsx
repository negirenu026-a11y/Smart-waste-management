import React, { useState, useEffect } from 'react';
import { cities, zones } from '../../../utils/dashboardData';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        city: '',
        zone: '',
        ward: '',
        location: ''
    });

    useEffect(() => {
        const saved = localStorage.getItem('citizen_registration');
        if (saved) {
            setFormData(JSON.parse(saved));
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        localStorage.setItem('citizen_registration', JSON.stringify(formData));
        alert('Registration data saved successfully!');
    };

    return (
        <div className="dashboard-section-wrap p-4">
            <header className="mb-4">
                <h2 className="fw-bold">Register Itself</h2>
                <p className="text-muted">Update your personal and residential details.</p>
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
                        <label className="form-label fw-bold small text-uppercase">Email Address</label>
                        <input 
                            type="email" 
                            name="email"
                            className="form-control p-3 bg-light border-0" 
                            placeholder="Email address" 
                            value={formData.email}
                            onChange={handleChange}
                            required
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
                    <div className="col-md-6">
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
                            Save Registration Data
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
