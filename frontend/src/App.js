import React, { useEffect, useState } from "react";
import QueueForm from "./components/QueueForm";
import QueueList from "./components/QueueList";
import AdminLogin from "./components/AdminLogin";
import { io } from "socket.io-client";
import axios from "axios";
import "./App.css";
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const socket = io(API_URL);

function App() {
    const [queue, setQueue] = useState([]);
    const [token, setToken] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [view, setView] = useState("user"); // 'user' or 'admin'

    useEffect(() => {
        const fetchQueue = async () => {
            const res = await axios.get(`${API_URL}/api/queue`);
            setQueue(res.data);
        };
        fetchQueue();

        socket.on("queueUpdated", (updatedQueue) => setQueue(updatedQueue));
        return () => socket.off("queueUpdated");
    }, []);

    const removeNextVehicle = async () => {
        if (window.confirm("Mark next vehicle as served?")) {
            await axios.delete(`${API_URL}/api/queue/next`);
        }
    };

    return (
        <div className="container">
            <header className="header">
                <h1>Smart Fuel Queue</h1>
                <p>Efficiently manage your fuel refill timing</p>
            </header>

            <div className="view-selector">
                <select 
                    className="select-box" 
                    value={view} 
                    onChange={(e) => setView(e.target.value)}
                >
                    <option value="user">👤 Book Slot</option>
                    <option value="admin">🔐 Admin Panel</option>
                </select>
            </div>

            {view === "user" ? (
                <div className="card">
                    <h2>Book Your Slot</h2>
                    <QueueForm setQueue={setQueue} setToken={setToken} />
                    
                    {token && (
                        <div className="token-card">
                            <h3>✅ Your Booking Confirmed</h3>
                            <div className="token-detail">
                                <strong>Name:</strong> <span>{token.name}</span>
                            </div>
                            <div className="token-detail">
                                <strong>Vehicle:</strong> <span>{token.vehicleNumber}</span>
                            </div>
                            <div className="token-detail">
                                <strong>Token ID:</strong> <span>#{token.serialNumber}</span>
                            </div>
                            <div className="token-detail">
                                <strong>Est. Time:</strong> <span>{new Date(token.estimatedTime).toLocaleTimeString()}</span>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="card">
                    <h2>Admin Access</h2>
                    {!isAdmin ? (
                        <AdminLogin setIsAdmin={setIsAdmin} />
                    ) : (
                        <div>
                            <p style={{ color: "green", fontWeight: "bold" }}>Welcome, Admin!</p>
                            <button className="btn-danger" onClick={removeNextVehicle}>
                                Serve Next Vehicle
                            </button>
                        </div>
                    )}
                </div>
            )}

            <div className="card">
                <h3>Live Queue Status</h3>
                <QueueList queue={queue} />
            </div>
        </div>
    );
}

export default App;