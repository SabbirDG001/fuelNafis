import React, { useState } from "react";
import axios from "axios";

const QueueForm = ({ setQueue, setToken }) => {
    const [name, setName] = useState("");
    const [vehicleNumber, setVehicleNumber] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !vehicleNumber) return alert("Please fill all fields");

        setLoading(true);
        try {
            const res = await axios.post("http://localhost:5000/api/queue/join", { name, vehicleNumber });
            setToken(res.data);
            // setQueue(prev => [...prev, res.data]); // Removed to prevent double updates
            setName(""); setVehicleNumber("");
        } catch (err) {
            alert("Error booking slot. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Full Name</label>
                <input 
                    placeholder="Enter your name" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    disabled={loading}
                />
            </div>
            <div className="form-group">
                <label>Vehicle Number</label>
                <input 
                    placeholder="e.g. CAS-1234" 
                    value={vehicleNumber} 
                    onChange={e => setVehicleNumber(e.target.value)} 
                    disabled={loading}
                />
            </div>
            <button className="btn-primary" type="submit" disabled={loading}>
                {loading ? "Processing..." : "Book My Slot"}
            </button>
        </form>
    );
};

export default QueueForm;