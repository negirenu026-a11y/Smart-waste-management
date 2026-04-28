import React, { useState, useEffect } from 'react';
import api from '../../../utils/api';
import { toast } from 'react-toastify';

const MakeComplaint = () => {
    const [areas, setAreas] = useState([]);
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

    useEffect(() => {
        fetchAvailableAreas();
    }, []);

    const fetchAvailableAreas = async () => {
        try {
            const res = await api.get("/areas");
            setAreas(res.data.areas || []);
        } catch (err) {
            console.error("Error fetching areas:", err);
            toast.error("Failed to load operational areas.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Reset dependent fields when higher level selection changes
        if (name === 'city') {
            setFormData({ ...formData, city: value, zone: '', area: '', location: '', ward: '' });
        } else if (name === 'zone') {
            setFormData({ ...formData, zone: value, area: '', location: '', ward: '' });
        } else if (name === 'area') {
            const selectedArea = areas.find(a => a.name === value);
            setFormData({ 
                ...formData, 
                area: value, 
                location: selectedArea ? selectedArea.location : '',
                ward: selectedArea ? selectedArea.ward : ''
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
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
        if (!formData.image) {
            toast.warning("Please upload an evidence image.");
            return;
        }
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

    // Derive dropdown options from fetched areas
    const availableCities = [...new Set(areas.map(a => a.city))];
    const availableZones = [...new Set(areas.filter(a => a.city === formData.city).map(a => a.zone))];
    const availableSpecificAreas = areas.filter(a => a.city === formData.city && a.zone === formData.zone);

    return (
        <div className="dashboard-section-wrap p-4">
            <header className="mb-4">
                <h2 className="fw-bold">Report an Issue</h2>
                <p className="text-muted">Submit a waste management complaint for your specific area.</p>
            </header>

            <div className="dashboard-card p-4 shadow-sm border-0 bg-white">
                <form onSubmit={handleSubmit} className="row g-4">
                    <div className="col-md-12">
                        <label className="form-label fw-bold small text-uppercase">Evidence Image</label>
                        <div className="d-flex align-items-center gap-4">
                            <div className="border rounded d-flex align-items-center justify-content-center bg-light shadow-sm" style={{ width: '120px', height: '120px', overflow: 'hidden' }}>
                                {preview ? <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <i className="fas fa-camera fa-2x text-muted"></i>}
                            </div>
                            <div className="flex-grow-1">
                                <input type="file" accept="image/*" className="form-control p-3" onChange={handleImageChange} required />
                                <small className="text-muted mt-1 d-block">Upload a clear photo of the waste issue.</small>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <label className="form-label fw-bold small text-uppercase">City</label>
                        <select name="city" className="form-select p-3 bg-light border-0" value={formData.city} onChange={handleChange} required>
                            <option value="">Select City</option>
                            {availableCities.map(city => <option key={city} value={city}>{city}</option>)}
                        </select>
                    </div>
                    <div className="col-md-4">
                        <label className="form-label fw-bold small text-uppercase">Zone</label>
                        <select name="zone" className="form-select p-3 bg-light border-0" value={formData.zone} onChange={handleChange} required disabled={!formData.city}>
                            <option value="">Select Zone</option>
                            {availableZones.map(zone => <option key={zone} value={zone}>{zone}</option>)}
                        </select>
                    </div>
                    <div className="col-md-4">
                        <label className="form-label fw-bold small text-uppercase">Specific Area</label>
                        <select name="area" className="form-select p-3 bg-light border-0" value={formData.area} onChange={handleChange} required disabled={!formData.zone}>
                            <option value="">Select Area</option>
                            {availableSpecificAreas.map(a => <option key={a._id} value={a.name}>{a.name}</option>)}
                        </select>
                    </div>

                    <div className="col-md-4">
                        <label className="form-label fw-bold small text-uppercase">Ward</label>
                        <input type="text" name="ward" className="form-control p-3 bg-light border-0" value={formData.ward} readOnly placeholder="Auto-filled" />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label fw-bold small text-uppercase">Location Info</label>
                        <input type="text" name="location" className="form-control p-3 bg-light border-0" value={formData.location} readOnly placeholder="Auto-filled" />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label fw-bold small text-uppercase">Category</label>
                        <select name="category" className="form-select p-3 bg-light border-0" value={formData.category} onChange={handleChange} required>
                            <option value="Food Waste">Food Waste</option>
                            <option value="Plastic">Plastic Waste</option>
                            <option value="E-Waste">E-Waste</option>
                            <option value="Hazardous Waste">Hazardous Waste</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="col-12">
                        <label className="form-label fw-bold small text-uppercase">Detailed Description</label>
                        <textarea 
                            name="description"
                            className="form-control p-3 bg-light border-0" 
                            rows="4" 
                            placeholder="Please describe the issue in detail..."
                            value={formData.description}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </div>

                    <div className="col-12 text-end">
                        <button type="submit" className="btn btn-success px-5 py-3 shadow-sm fw-bold" disabled={submitting}>
                            {submitting ? "Submitting..." : "Submit Complaint"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MakeComplaint;
