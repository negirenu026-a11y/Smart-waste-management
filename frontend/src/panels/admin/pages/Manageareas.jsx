import React, { useState, useEffect } from "react";
import { cities, zones } from "../../../utils/dashboardData";
import api from "../../../utils/api";
import { toast } from "react-toastify";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const LocationPicker = ({ onLocationSelect }) => {
    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            onLocationSelect(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
        },
    });
    return null;
};

const Manageareas = () => {
    const [areas, setAreas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ 
        name: "", 
        city: "", 
        zone: "", 
        ward: "", 
        location: "" 
    });
    const [editingArea, setEditingArea] = useState(null);
    const [mapCenter, setMapCenter] = useState([31.1048, 77.1734]); // Default to Shimla area

    useEffect(() => {
        fetchAreas();
    }, []);

    const fetchAreas = async () => {
        try {
            setLoading(true);
            const res = await api.get("/areas");
            setAreas(res.data.areas || []);
        } catch (err) {
            toast.error("Failed to fetch operational areas.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/areas", form);
            if (res.data.success) {
                toast.success("Area added successfully!");
                setForm({ name: "", city: "", zone: "", ward: "", location: "" });
                fetchAreas();
            }
        } catch (err) {
            toast.error("Failed to add area.");
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await api.patch(`/areas/${editingArea._id}`, form);
            if (res.data.success) {
                toast.success("Area updated successfully!");
                setEditingArea(null);
                setForm({ name: "", city: "", zone: "", ward: "", location: "" });
                fetchAreas();
            }
        } catch (err) {
            toast.error("Failed to update area.");
        }
    };

    const startEdit = (area) => {
        setEditingArea(area);
        setForm({
            name: area.name,
            city: area.city,
            zone: area.zone,
            ward: area.ward,
            location: area.location
        });
        
        // Try to parse location as lat/lng if it's in that format
        const coords = area.location.split(",").map(c => parseFloat(c.trim()));
        if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
            setMapCenter(coords);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this area?")) return;
        try {
            const res = await api.delete(`/areas/${id}`);
            if (res.data.success) {
                toast.success("Area deleted.");
                fetchAreas();
            }
        } catch (err) {
            toast.error("Failed to delete area.");
        }
    };

    return (
        <div className="dashboard-section-wrap p-4">
            <header className="mb-4">
                <h2 className="fw-bold">Manage Operational Areas</h2>
                <p className="text-muted">Define and manage operational zones with interactive map mapping.</p>
            </header>

            <div className="row g-4">
                <div className="col-lg-5">
                    <div className="dashboard-card p-4 shadow-sm border-0 bg-white">
                        <h5 className="fw-bold mb-4">{editingArea ? "Edit Service Area" : "Add New Service Area"}</h5>
                        <form onSubmit={editingArea ? handleUpdate : handleAdd}>
                            <div className="row g-3">
                                <div className="col-12">
                                    <label className="form-label small fw-bold">Area Name</label>
                                    <input className="form-control" name="name" placeholder="e.g. Park Avenue"
                                        value={form.name} onChange={handleChange} required />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold">City</label>
                                    <select className="form-select" name="city" value={form.city} onChange={handleChange} required>
                                        <option value="">Select City</option>
                                        {cities.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold">Zone</label>
                                    <select className="form-select" name="zone" value={form.zone} onChange={handleChange} required>
                                        <option value="">Select Zone</option>
                                        {zones.map(z => <option key={z} value={z}>{z}</option>)}
                                    </select>
                                </div>
                                <div className="col-12">
                                    <label className="form-label small fw-bold">Ward</label>
                                    <input className="form-control" name="ward" placeholder="e.g. Ward 12"
                                        value={form.ward} onChange={handleChange} required />
                                </div>
                                <div className="col-12">
                                    <label className="form-label small fw-bold">Location (Coordinates or Address)</label>
                                    <div className="input-group">
                                        <input className="form-control" name="location" placeholder="Select on map or type"
                                            value={form.location} onChange={handleChange} required />
                                        <span className="input-group-text bg-light"><i className="fas fa-map-marker-alt"></i></span>
                                    </div>
                                    <small className="text-muted">Tip: Click on the map to automatically fill coordinates.</small>
                                </div>
                                <div className="col-12 text-end d-flex gap-2 justify-content-end mt-4">
                                    {editingArea && (
                                        <button className="btn btn-light px-4" type="button" onClick={() => {
                                            setEditingArea(null);
                                            setForm({ name: "", city: "", zone: "", ward: "", location: "" });
                                        }}>Cancel</button>
                                    )}
                                    <button className="btn btn-primary px-4" type="submit">
                                        {editingArea ? "Update Area" : "Add Area"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="col-lg-7">
                    <div className="dashboard-card p-0 shadow-sm border-0 bg-white overflow-hidden" style={{ height: '500px' }}>
                        <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <LocationPicker onLocationSelect={(loc) => setForm(f => ({ ...f, location: loc }))} />
                            
                            {areas.map(area => {
                                const coords = area.location.split(",").map(c => parseFloat(c.trim()));
                                if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
                                    return (
                                        <Marker key={area._id} position={coords}>
                                            <Popup>
                                                <div className="p-1">
                                                    <h6 className="fw-bold mb-1">{area.name}</h6>
                                                    <p className="mb-0 small">{area.city} | {area.ward}</p>
                                                    <button className="btn btn-xs btn-primary mt-2 w-100" onClick={() => startEdit(area)}>Edit</button>
                                                </div>
                                            </Popup>
                                        </Marker>
                                    );
                                }
                                return null;
                            })}
                        </MapContainer>
                    </div>
                </div>
            </div>

            <div className="dashboard-card p-0 overflow-hidden shadow-sm border-0 bg-white mt-4">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th className="ps-4">Area Name</th>
                                <th>City</th>
                                <th>Zone / Ward</th>
                                <th>Location Info</th>
                                <th className="pe-4 text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5} className="text-center py-5">Loading areas...</td></tr>
                            ) : areas.length === 0 ? (
                                <tr><td colSpan={5} className="text-center text-muted py-5">No operational areas defined yet.</td></tr>
                            ) : (
                                areas.map((area) => (
                                    <tr key={area._id}>
                                        <td className="ps-4 fw-bold">{area.name}</td>
                                        <td>{area.city}</td>
                                        <td>{area.zone} - {area.ward}</td>
                                        <td>
                                            <span className="small text-truncate d-block" style={{ maxWidth: '150px' }}>{area.location}</span>
                                        </td>
                                        <td className="pe-4 text-end">
                                            <div className="d-flex gap-2 justify-content-end">
                                                <button className="btn btn-sm btn-outline-primary" onClick={() => startEdit(area)}>
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(area._id)}>
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Manageareas;