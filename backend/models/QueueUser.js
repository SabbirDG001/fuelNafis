const mongoose = require("mongoose");

const queueUserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    vehicleNumber: { type: String, required: true },
    serialNumber: { type: Number, required: true },
    estimatedTime: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("QueueUser", queueUserSchema);