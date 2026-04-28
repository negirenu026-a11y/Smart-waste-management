import React, { useState } from 'react';
import { cities, zones } from '../../../utils/dashboardData';
import api from '../../../utils/api';
import { toast } from 'react-toastify';

const MakeComplaint = () => {
    const [formData, setFormData] = useState({
        image: null,
        area: '',
        location: '',
        ward: '',
        zone: '',
        city: '',
        category: 'Other',
        description: ''
    });

    const [preview, setPreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        
        try {
            const data = new FormData();
            data.append("image", formData.image);
            data.append("area", formData.area);
            data.append("location", formData.location);
            data.append("ward", formData.ward);
            data.append("zone", formData.zone);
            data.append("city", formData.city);
            data.append("category", formData.category);
            data.append("description", formData.description);

            const res = await api.post("/complaints", data, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (res.data.success) {
                toast.success('Complaint submitted successfully!');
                setFormData({
                    image: null,
                    area: '',
                    location: '',
                    ward: '',
                    zone: '',
                    city: '',
                    category: 'Other',
                    description: ''
                });
                setPreview(null);
            }
        } catch (err) {
            toast.error("Failed to submit complaint.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="dashboard-section-wrap p-4">
            <header className="mb-4">
                <h2 className="fw-bold">Make a Complaint</h2>
                <p className="text-muted">Report waste management issues in your area.</p>
            </header>

            <div className="dashboard-card p-4 shadow-sm border-0 bg-white">
                <form onSubmit={handleSubmit} className="row g-4">
                    <div className="col-md-12">
                        <label className="form-label fw-bold small text-uppercase">Upload Evidence Image</label>
                        <div className="d-flex align-items-start gap-4">
                            <div 
                                className="border rounded d-flex align-items-center justify-content-center bg-light" 
                                style={{ width: '150px', height: '150px', overflow: 'hidden' }}
                            >
                                {preview ? (
                                    <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <i className="fas fa-camera fa-2x text-muted"></i>
                                )}
                            </div>
                            <input 
                                type="file" 
                                accept="image/*"
                                className="form-control" 
                                onChange={handleImageChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="col-md-4">
                        <label className="form-label fw-bold small text-uppercase">City</label>
                        <select name="city" className="form-select p-3 bg-light border-0" value={formData.city} onChange={handleChange} required>
                            <option value="">Select City</option>
                            {cities.map(city => <option key={city} value={city}>{city}</option>)}
                        </select>
                    </div>
                    <div className="col-md-4">
                        <label className="form-label fw-bold small text-uppercase">Zone</label>
                        <select name="zone" className="form-select p-3 bg-light border-0" value={formData.zone} onChange={handleChange} required>
                            <option value="">Select Zone</option>
                            {zones.map(zone => <option key={zone} value={zone}>{zone}</option>)}
                        </select>
                    </div>
                    <div className="col-md-4">
                        <label className="form-label fw-bold small text-uppercase">Category</label>
                        <select name="category" className="form-select p-3 bg-light border-0" value={formData.category} onChange={handleChange} required>
                            <option value="Food">Food Waste</option>
                            <option value="Plastic">Plastic Waste</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="col-md-4">
                        <label className="form-label fw-bold small text-uppercase">Area</label>
                        <input type="text" name="area" className="form-control p-3 bg-light border-0" placeholder="e.g. Sector 5" value={formData.area} onChange={handleChange} required />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label fw-bold small text-uppercase">Ward</label>
                        <input type="text" name="ward" className="form-control p-3 bg-light border-0" placeholder="e.g. Ward 12" value={formData.ward} onChange={handleChange} required />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label fw-bold small text-uppercase">Specific Location</label>
                        <input type="text" name="location" className="form-control p-3 bg-light border-0" placeholder="e.g. Near Park Gate" value={formData.location} onChange={handleChange} required />
                    </div>

                    <div className="col-12">
                        <label className="form-label fw-bold small text-uppercase">Issue Description</label>
                        <textarea 
                            name="description"
                            className="form-control p-3 bg-light border-0" 
                            rows="4" 
                            placeholder="Provide more details about the issue..."
                            value={formData.description}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </div>

                    <div className="col-12 text-end">
                        <button type="submit" className="btn btn-success px-5 py-3 shadow-sm fw-bold">
                            Submit Complaint
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MakeComplaint;
