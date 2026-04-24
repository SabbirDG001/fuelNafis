const express = require("express");
const router = express.Router();
const QueueUser = require("../models/QueueUser");

// Join queue
router.post("/join", async (req, res) => {
    try {
        const { name, vehicleNumber } = req.body;
        if (!name || !vehicleNumber) return res.status(400).json({ message: "All fields required" });

        const count = await QueueUser.countDocuments();
        const serialNumber = count + 1;
        const estimatedTime = new Date(Date.now() + serialNumber * 2 * 60 * 1000);

        const user = new QueueUser({ name, vehicleNumber, serialNumber, estimatedTime });
        await user.save();

        const updatedQueue = await QueueUser.find().sort({ serialNumber: 1 });
        req.io.emit("queueUpdated", updatedQueue);

        res.status(201).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Get full queue
router.get("/", async (req, res) => {
    try {
        const queue = await QueueUser.find().sort({ serialNumber: 1 });
        res.json(queue);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Remove first vehicle (Next Vehicle Served)
router.delete("/next", async (req, res) => {
    try {
        const firstUser = await QueueUser.findOne().sort({ serialNumber: 1 });
        if (!firstUser) return res.status(404).json({ message: "Queue empty" });

        await firstUser.deleteOne();

        const remaining = await QueueUser.find().sort({ serialNumber: 1 });
        for (let i = 0; i < remaining.length; i++) {
            remaining[i].serialNumber = i + 1;
            remaining[i].estimatedTime = new Date(Date.now() + (i + 1) * 2 * 60 * 1000);
            await remaining[i].save();
        }

        req.io.emit("queueUpdated", remaining);
        res.json({ message: "First user removed", queue: remaining });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;