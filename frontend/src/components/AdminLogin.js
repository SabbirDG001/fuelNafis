import React, { useState } from "react";
import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const AdminLogin = ({ setIsAdmin }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post(`${API_URL}/api/admin/login`, { username, password });
            if (res.data.success) {
                setIsAdmin(true);
                alert("Welcome back, Admin!");
            }
        } catch (err) {
            alert("Invalid credentials. Try: admin / password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <div className="form-group">
                <label>Username</label>
                <input 
                    placeholder="Enter admin username" 
                    value={username} 
                    onChange={e => setUsername(e.target.value)} 
                    disabled={loading}
                />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input 
                    type="password" 
                    placeholder="Enter password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    disabled={loading}
                />
            </div>
            <button className="btn-primary" type="submit" disabled={loading}>
                {loading ? "Verifying..." : "Login to Dashboard"}
            </button>
        </form>
    );
};

export default AdminLogin;