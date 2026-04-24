const express = require("express");
const router = express.Router();

router.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (username === "admin" && password === "password") {
        res.json({ success: true, message: "Login successful" });
    } else {
        res.status(401).json({ success: false, message: "Invalid credentials" });
    }
});

module.exports = router;