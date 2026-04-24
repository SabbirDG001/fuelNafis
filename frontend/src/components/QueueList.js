import React from "react";

const QueueList = ({ queue }) => {
    if (queue.length === 0) {
        return (
            <div style={{ textAlign: "center", padding: "20px", color: "#888" }}>
                <p>No vehicles in the queue.</p>
            </div>
        );
    }

    return (
        <ul className="queue-list">
            {queue.map((u, index) => (
                <li key={u._id} className="queue-item">
                    <div className="serial-badge">{index + 1}</div>
                    <div className="user-info">
                        <strong>{u.name}</strong>
                        <div style={{ color: "#666", fontSize: "0.85rem" }}>
                            Vehicle: {u.vehicleNumber}
                        </div>
                    </div>
                    <div className="time-info">
                        🕒 {new Date(u.estimatedTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default QueueList;