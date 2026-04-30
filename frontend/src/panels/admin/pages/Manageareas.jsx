import React, { useState, useEffect } from "react";
import { districts, HIMACHAL_DATA, zones } from "../../../utils/dashboardData";
import api from "../../../utils/api";
import { toast } from "react-toastify";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const MapController = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center) map.setView(center, 13);
    }, [center, map]);
    return null;
};

const Manageareas = () => {
    const [areas, setAreas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ 
        name: "", 
        district: "",
        city: "", 
        zone: "", 
        ward: "", 
        pincode: ""
    });
    const [editingArea, setEditingArea] = useState(null);
    const [mapCenter, setMapCenter] = useState([31.1048, 77.1734]); // Shimla
    const [previewCoords, setPreviewCoords] = useState(null);

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => {
            const updated = { ...prev, [name]: value };
            if (name === "district") updated.city = ""; // Reset city if district changes
            return updated;
        });

        if (name === "pincode" && value.length === 6) {
            fetchCoordsFromPincode(value);
        }
    };

    const fetchCoordsFromPincode = async (pin) => {
        try {
            const res = await axios.get(`https://nominatim.openstreetmap.org/search?postalcode=${pin}&country=India&format=json`);
            if (res.data && res.data.length > 0) {
                const coords = [parseFloat(res.data[0].lat), parseFloat(res.data[0].lon)];
                setPreviewCoords(coords);
                setMapCenter(coords);
                toast.info("Location fetched from pincode!");
            }
        } catch (err) {
            console.error("Geocoding failed");
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/areas", form);
            if (res.data.success) {
                toast.success("Area added successfully!");
                resetForm();
                fetchAreas();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to add area.");
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await api.patch(`/areas/${editingArea._id}`, form);
            if (res.data.success) {
                toast.success("Area updated successfully!");
                resetForm();
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
            district: area.district,
            city: area.city,
            zone: area.zone,
            ward: area.ward,
            pincode: area.pincode
        });
        if (area.coordinates) {
            setMapCenter([area.coordinates.lat, area.coordinates.lng]);
            setPreviewCoords([area.coordinates.lat, area.coordinates.lng]);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this area?")) return;
        try {
            await api.delete(`/areas/${id}`);
            toast.success("Area deleted.");
            fetchAreas();
        } catch (err) {
            toast.error("Failed to delete area.");
        }
    };

    const resetForm = () => {
        setForm({ name: "", district: "", city: "", zone: "", ward: "", pincode: "" });
        setEditingArea(null);
        setPreviewCoords(null);
    };

    return (
        <div className="dashboard-section-wrap p-4">
            <header className="mb-4">
                <h2 className="fw-bold">Manage Operational Areas</h2>
                <p className="text-muted">Himachal Pradesh Smart Waste Management - Area & MC Mapping</p>
            </header>

            <div className="row g-4">
                <div className="col-lg-5">
                    <div className="dashboard-card p-4 shadow-sm border-0 bg-white">
                        <h5 className="fw-bold mb-4">{editingArea ? "Edit Service Area" : "Add New Area"}</h5>
                        <form onSubmit={editingArea ? handleUpdate : handleAdd}>
                            <div className="row g-3">
                                <div className="col-12">
                                    <label className="form-label small fw-bold">Area Name</label>
                                    <input className="form-control" name="name" placeholder="e.g. Lower Bazar"
                                        value={form.name} onChange={handleChange} required />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold">District</label>
                                    <select className="form-select" name="district" value={form.district} onChange={handleChange} required>
                                        <option value="">Select District</option>
                                        {districts.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold">City</label>
                                    <select className="form-select" name="city" value={form.city} onChange={handleChange} required disabled={!form.district}>
                                        <option value="">Select City</option>
                                        {form.district && HIMACHAL_DATA[form.district].map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold">Zone</label>
                                    <select className="form-select" name="zone" value={form.zone} onChange={handleChange} required>
                                        <option value="">Select Zone</option>
                                        {zones.map(z => <option key={z} value={z}>{z}</option>)}
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold">Ward</label>
                                    <input className="form-control" name="ward" placeholder="e.g. Ward 1"
                                        value={form.ward} onChange={handleChange} required />
                                </div>
                                <div className="col-12">
                                    <label className="form-label small fw-bold">Pincode</label>
                                    <input className="form-control" name="pincode" placeholder="6-digit pincode" maxLength="6"
                                        value={form.pincode} onChange={handleChange} required />
                                </div>
                                <div className="col-12 text-end d-flex gap-2 justify-content-end mt-4">
                                    <button className="btn btn-light px-4" type="button" onClick={resetForm}>Cancel</button>
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
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <MapController center={mapCenter} />
                            
                            {previewCoords && (
                                <Marker position={previewCoords}>
                                    <Popup>Preview Location</Popup>
                                </Marker>
                            )}

                            {areas.map(area => (
                                area.coordinates && (
                                    <Marker key={area._id} position={[area.coordinates.lat, area.coordinates.lng]}>
                                        <Popup>
                                            <div className="p-1">
                                                <h6 className="fw-bold mb-1">{area.name}</h6>
                                                <p className="mb-0 small">{area.city}, {area.district}</p>
                                                <p className="mb-0 small text-primary">MC: {area.mcId ? area.mcId.name : "Unassigned"}</p>
                                            </div>
                                        </Popup>
                                    </Marker>
                                )
                            ))}
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
                                <th>District / City</th>
                                <th>Zone / Ward / Pin</th>
                                <th>Assigned MC</th>
                                <th className="pe-4 text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5} className="text-center py-5">Loading areas...</td></tr>
                            ) : (
                                areas.map((area) => (
                                    <tr key={area._id}>
                                        <td className="ps-4 fw-bold">{area.name}</td>
                                        <td>{area.district} - {area.city}</td>
                                        <td>{area.zone} | {area.ward} | {area.pincode}</td>
                                        <td>
                                            {area.mcId ? (
                                                <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-2 py-1">
                                                    {area.mcId.name}
                                                </span>
                                            ) : (
                                                <span className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25 px-2 py-1">
                                                    Unassigned
                                                </span>
                                            )}
                                        </td>
                                        <td className="pe-4 text-end">
                                            <div className="d-flex gap-2 justify-content-end">
                                                <button className="btn btn-sm btn-outline-primary" onClick={() => startEdit(area)}><i className="fas fa-edit"></i></button>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(area._id)}><i className="fas fa-trash"></i></button>
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