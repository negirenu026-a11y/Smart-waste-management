import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

const API_BASE_URL = "http://localhost:4000/api";

const countryOptions = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia", "Australia",
    "Austria", "Azerbaijan", "Bahrain", "Bangladesh", "Belarus", "Belgium", "Bhutan", "Bolivia",
    "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Cambodia", "Cameroon", "Canada",
    "Chile", "China", "Colombia", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
    "Denmark", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Estonia", "Ethiopia", "Finland",
    "France", "Georgia", "Germany", "Ghana", "Greece", "Guatemala", "Hungary", "Iceland", "India",
    "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan",
    "Kazakhstan", "Kenya", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Libya", "Lithuania",
    "Luxembourg", "Madagascar", "Malaysia", "Maldives", "Mexico", "Moldova", "Mongolia", "Morocco",
    "Myanmar", "Nepal", "Netherlands", "New Zealand", "Nigeria", "North Korea", "Norway", "Oman",
    "Pakistan", "Panama", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania",
    "Russia", "Saudi Arabia", "Serbia", "Singapore", "Slovakia", "Slovenia", "Somalia", "South Africa",
    "South Korea", "Spain", "Sri Lanka", "Sudan", "Sweden", "Switzerland", "Syria", "Taiwan",
    "Tajikistan", "Tanzania", "Thailand", "Tunisia", "Turkey", "Turkmenistan", "Uganda", "Ukraine",
    "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Venezuela",
    "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

const indiaStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
    "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
    "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi",
    "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

const indiaStateCityMap = {
    "Andhra Pradesh": ["Amaravati", "Anantapur", "Chittoor", "Guntur", "Kadapa", "Kakinada", "Kurnool", "Nellore", "Rajahmundry", "Tirupati", "Vijayawada", "Visakhapatnam"],
    "Arunachal Pradesh": ["Along", "Bomdila", "Itanagar", "Naharlagun", "Pasighat", "Tawang", "Tezu", "Ziro"],
    "Assam": ["Bongaigaon", "Dhubri", "Dibrugarh", "Guwahati", "Jorhat", "Nagaon", "Silchar", "Sivasagar", "Tezpur", "Tinsukia"],
    "Bihar": ["Arrah", "Begusarai", "Bhagalpur", "Bihar Sharif", "Darbhanga", "Gaya", "Hajipur", "Muzaffarpur", "Patna", "Purnia", "Saharasa", "Siwan"],
    "Chhattisgarh": ["Ambikapur", "Bhilai", "Bilaspur", "Dhamtari", "Durg", "Jagdalpur", "Korba", "Mahasamund", "Raigarh", "Raipur", "Rajnandgaon"],
    "Goa": ["Bicholim", "Madgaon", "Mapusa", "Mormugao", "Panaji", "Ponda", "Sanquelim", "Vasco da Gama", "Canacona", "Curchorem"],
    "Gujarat": ["Ahmedabad", "Anand", "Bhavnagar", "Bhuj", "Gandhinagar", "Jamnagar", "Junagadh", "Rajkot", "Surat", "Vadodara", "Bharuch", "Navsari"],
    "Haryana": ["Ambala", "Faridabad", "Gurugram", "Hisar", "Karnal", "Kurukshetra", "Panipat", "Panchkula", "Rohtak", "Sonipat", "Yamunanagar", "Rewari"],
    "Himachal Pradesh": ["Baddi", "Bilaspur", "Chamba", "Dharamshala", "Hamirpur", "Kangra", "Kullu", "Mandi", "Nahan", "Palampur", "Shimla", "Solan", "Una", "Nurpur", "Nadaun", "Jawali", "Dehra", "Shahpur", "Indora", "Dalhousie", "Manali", "Paonta Sahib"],
    "Jharkhand": ["Bokaro", "Deoghar", "Dhanbad", "Giridih", "Hazaribagh", "Jamshedpur", "Medininagar", "Ranchi", "Phusro", "Ramgarh"],
    "Karnataka": ["Ballari", "Belagavi", "Bengaluru", "Bidar", "Davanagere", "Hubballi", "Kalaburagi", "Mangaluru", "Mysuru", "Shivamogga", "Tumakuru", "Udupi", "Hassan", "Raichur"],
    "Kerala": ["Alappuzha", "Ernakulam", "Kannur", "Kasaragod", "Kochi", "Kollam", "Kottayam", "Kozhikode", "Palakkad", "Thiruvananthapuram", "Thrissur", "Malappuram", "Vatakara"],
    "Madhya Pradesh": ["Bhopal", "Burhanpur", "Chhindwara", "Dewas", "Gwalior", "Indore", "Jabalpur", "Katni", "Rewa", "Sagar", "Satna", "Ujjain", "Ratlam", "Singrauli"],
    "Maharashtra": ["Ahmednagar", "Amravati", "Aurangabad", "Kolhapur", "Mumbai", "Nagpur", "Nanded", "Nashik", "Pimpri-Chinchwad", "Pune", "Solapur", "Thane", "Akola", "Latur"],
    "Manipur": ["Bishnupur", "Chandel", "Imphal", "Kakching", "Senapati", "Thoubal", "Ukhrul", "Jiribam", "Moreh"],
    "Meghalaya": ["Baghmara", "Jowai", "Nongpoh", "Shillong", "Tura", "Williamnagar", "Resubelpara", "Mairang"],
    "Mizoram": ["Aizawl", "Champhai", "Kolasib", "Lunglei", "Saiha", "Serchhip", "Mamit", "Lawngtlai"],
    "Nagaland": ["Dimapur", "Kohima", "Mokokchung", "Mon", "Phek", "Tuensang", "Wokha", "Zunheboto", "Kiphire", "Longleng"],
    "Odisha": ["Balasore", "Berhampur", "Bhadrak", "Bhubaneswar", "Cuttack", "Puri", "Rourkela", "Sambalpur", "Baripada", "Jharsuguda"],
    "Punjab": ["Amritsar", "Bathinda", "Jalandhar", "Ludhiana", "Mohali", "Pathankot", "Patiala", "Sangrur", "Hoshiarpur", "Moga", "Abohar", "Phagwara"],
    "Rajasthan": ["Ajmer", "Alwar", "Bikaner", "Jaipur", "Jodhpur", "Kota", "Sikar", "Sri Ganganagar", "Udaipur", "Bhilwara", "Bharatpur", "Pali"],
    "Sikkim": ["Gangtok", "Gyalshing", "Jorethang", "Mangan", "Namchi", "Rangpo", "Singtam", "Nayabazar"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Cuddalore", "Erode", "Madurai", "Nagercoil", "Salem", "Thanjavur", "Tiruchirappalli", "Tirunelveli", "Vellore", "Thoothukudi", "Dindigul"],
    "Telangana": ["Hyderabad", "Karimnagar", "Khammam", "Mahbubnagar", "Nalgonda", "Nizamabad", "Ramagundam", "Warangal", "Suryapet", "Miryalaguda"],
    "Tripura": ["Agartala", "Ambassa", "Belonia", "Dharmanagar", "Kailashahar", "Khowai", "Udaipur", "Amarpur", "Sabroom"],
    "Uttar Pradesh": ["Agra", "Aligarh", "Bareilly", "Ghaziabad", "Gorakhpur", "Jhansi", "Kanpur", "Lucknow", "Mathura", "Meerut", "Noida", "Prayagraj", "Varanasi", "Firozabad", "Saharanpur"],
    "Uttarakhand": ["Almora", "Dehradun", "Haldwani", "Haridwar", "Kashipur", "Nainital", "Pithoragarh", "Roorkee", "Rudrapur", "Rishikesh", "Mussoorie"],
    "West Bengal": ["Asansol", "Berhampore", "Durgapur", "Howrah", "Jalpaiguri", "Kharagpur", "Kolkata", "Malda", "Siliguri", "Bally", "Bardhaman", "Panihati"],
    "Andaman and Nicobar Islands": ["Car Nicobar", "Diglipur", "Mayabunder", "Port Blair", "Bamboo Flat"],
    "Chandigarh": ["Chandigarh"],
    "Dadra and Nagar Haveli and Daman and Diu": ["Daman", "Diu", "Silvassa", "Amli"],
    "Delhi": ["Central Delhi", "Dwarka", "New Delhi", "North Delhi", "Rohini", "South Delhi", "Najafgarh", "Narela"],
    "Jammu and Kashmir": ["Anantnag", "Baramulla", "Jammu", "Kathua", "Pulwama", "Srinagar", "Udhampur", "Sopore", "Handwara"],
    "Ladakh": ["Kargil", "Leh"],
    "Lakshadweep": ["Agatti", "Amini", "Kavaratti", "Minicoy", "Andrott"],
    "Puducherry": ["Karaikal", "Mahe", "Puducherry", "Yanam", "Ozhukarai"]
};


export default function Auth() {
    const navigate = useNavigate();
    const [authMode, setAuthMode] = useState("register");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showAdminModal, setShowAdminModal] = useState(false);

    const [formData, setFormData] = useState({
        role: "citizen",
        fullName: "",
        email: "",
        phone: "",
        country: "India",
        state: "",
        city: "",
        password: ""
    });

    const [loginData, setLoginData] = useState({ username: "", password: "" });
    const [adminData, setAdminData] = useState({ username: "", password: "" });

    const availableCities =
        formData.country === "India" && formData.state
            ? indiaStateCityMap[formData.state] || []
            : [];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setError("");
        setFormData((cur) => {
            if (name === "country") return { ...cur, country: value, state: "", city: "" };
            if (name === "state") return { ...cur, state: value, city: "" };
            return { ...cur, [name]: value };
        });
    };

    const handleLoginChange = (e) => {
        setError("");
        setLoginData((cur) => ({ ...cur, [e.target.name]: e.target.value }));
    };

    const handleAdminChange = (e) => {
        setError("");
        setAdminData((cur) => ({ ...cur, [e.target.name]: e.target.value }));
    };

    // ── Register ──────────────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const payload = {
                name: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                userType: formData.role,
                state: formData.state,
                city: formData.city
            };
            const res = await axios.post(`${API_BASE_URL}/register`, payload);
            if (res.data.success) {
                localStorage.setItem("wastewise-token", res.data.token);
                localStorage.setItem("wastewise-user", JSON.stringify(res.data.user));
                navigate(`/dashboard/${res.data.user.role}`);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // ── Login ─────────────────────────────────────────────────────────────
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await axios.post(`${API_BASE_URL}/login`, loginData);
            if (res.data.success) {
                localStorage.setItem("wastewise-token", res.data.token);
                localStorage.setItem("wastewise-user", JSON.stringify(res.data.user));
                navigate(`/dashboard/${res.data.user.role}`);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Invalid username or password.");
        } finally {
            setLoading(false);
        }
    };

    // ── Admin Login ───────────────────────────────────────────────────────
    const handleAdminLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await axios.post(`${API_BASE_URL}/login`, {
                username: adminData.username,
                password: adminData.password
            });
            if (res.data.success) {
                if (res.data.user.role !== "admin") {
                    setError("Access denied. Not an admin account.");
                    setLoading(false);
                    return;
                }
                localStorage.setItem("wastewise-token", res.data.token);
                localStorage.setItem("wastewise-user", JSON.stringify(res.data.user));
                setShowAdminModal(false);
                navigate("/dashboard/admin");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Invalid admin credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="section auth-page">
            {/* ── Admin Login Modal ───────────────────────────────────────── */}
            {showAdminModal && (
                <div className="admin-modal-overlay" onClick={() => setShowAdminModal(false)}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal__header">
                            <div className="admin-modal__icon">
                                <i className="fas fa-shield-alt"></i>
                            </div>
                            <h4>Admin Access Portal</h4>
                            <p>Restricted to authorized personnel only.</p>
                            <button className="admin-modal__close" onClick={() => setShowAdminModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        {error && <div className="alert alert-danger py-2 mb-3 small">{error}</div>}
                        <form onSubmit={handleAdminLogin} className="admin-modal__form">
                            <div className="admin-input-group">
                                <i className="fas fa-envelope"></i>
                                <input
                                    name="username"
                                    type="email"
                                    value={adminData.username}
                                    onChange={handleAdminChange}
                                    placeholder="Admin Email"
                                    required
                                />
                            </div>
                            <div className="admin-input-group">
                                <i className="fas fa-lock"></i>
                                <input
                                    name="password"
                                    type="password"
                                    value={adminData.password}
                                    onChange={handleAdminChange}
                                    placeholder="Admin Password"
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <button type="submit" className="admin-modal__submit" disabled={loading}>
                                {loading ? (
                                    <><i className="fas fa-spinner fa-spin me-2"></i>Verifying...</>
                                ) : (
                                    <><i className="fas fa-sign-in-alt me-2"></i>Access Dashboard</>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="container auth-layout auth-layout--centered">
                <div className="auth-card auth-card--centered mx-auto">

                    {/* ── Admin Button (top-right corner) ──────────────────── */}
                    <button
                        className="auth-admin-trigger"
                        onClick={() => { setShowAdminModal(true); setError(""); }}
                        title="Admin Login"
                        type="button"
                    >
                        <i className="fas fa-shield-alt"></i>
                        <span>Admin</span>
                    </button>

                    <div className="auth-switch">
                        <button type="button" className={authMode === "register" ? "is-active" : ""} onClick={() => { setAuthMode("register"); setError(""); }}>
                            Register Now
                        </button>
                        <button type="button" className={authMode === "login" ? "is-active" : ""} onClick={() => { setAuthMode("login"); setError(""); }}>
                            Log In
                        </button>
                    </div>

                    {error && !showAdminModal && (
                        <div className="alert alert-danger py-2 mb-3 small">{error}</div>
                    )}

                    {authMode === "register" ? (
                        <form className="auth-form" onSubmit={handleSubmit}>
                            <h3>Create Your Account</h3>

                            {/* Role: Only Citizen & MC — NO Admin */}
                            <div className="auth-role-selector">
                                <label
                                    className={`auth-role-card ${formData.role === "citizen" ? "is-selected" : ""}`}
                                    onClick={() => setFormData(f => ({ ...f, role: "citizen" }))}
                                >
                                    <i className="fas fa-user-circle"></i>
                                    <span>Citizen</span>
                                </label>
                                <label
                                    className={`auth-role-card ${formData.role === "mc" ? "is-selected" : ""}`}
                                    onClick={() => setFormData(f => ({ ...f, role: "mc" }))}
                                >
                                    <i className="fas fa-city"></i>
                                    <span>Municipal Corp (MC)</span>
                                </label>
                            </div>

                            <input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full name" required />
                            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email address" required />
                            <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone number" required />

                            <select name="country" value={formData.country} onChange={handleChange} required>
                                <option value="" disabled>Select country</option>
                                {countryOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>

                            {formData.country === "India" ? (
                                <select name="state" value={formData.state} onChange={handleChange} required>
                                    <option value="" disabled>Select state</option>
                                    {indiaStates.map((s) => <option key={s} value={s}>{s}</option>)}
                                </select>
                            ) : (
                                <input name="state" value={formData.state} onChange={handleChange} placeholder="State / Province" required />
                            )}

                            {formData.country === "India" ? (
                                <select name="city" value={formData.city} onChange={handleChange} required disabled={!formData.state}>
                                    <option value="" disabled>{formData.state ? "Select city" : "Select state first"}</option>
                                    {availableCities.map((city) => <option key={city} value={city}>{city}</option>)}
                                </select>
                            ) : (
                                <input name="city" value={formData.city} onChange={handleChange} placeholder="City" required />
                            )}

                            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Create password" required disabled={loading} />

                            <button
                                type="submit"
                                className={`button button--primary ${formData.role === "mc" ? "auth-button--mc" : ""}`}
                                disabled={loading}
                            >
                                {loading ? "Processing..." : formData.role === "mc" ? "Open MC Dashboard" : "Open Citizen Dashboard"}
                            </button>
                        </form>
                    ) : (
                        <form className="auth-form" onSubmit={handleLogin}>
                            <h3>Log In To Continue</h3>
                            <input
                                name="username"
                                value={loginData.username}
                                onChange={handleLoginChange}
                                placeholder="Email or username"
                                required
                            />
                            <input
                                type="password"
                                name="password"
                                value={loginData.password}
                                onChange={handleLoginChange}
                                placeholder="Password"
                                required
                                disabled={loading}
                            />
                            <button type="submit" className="button button--primary" disabled={loading}>
                                {loading ? "Logging in..." : "Log In"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
}
