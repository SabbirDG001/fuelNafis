const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const queueRoutes = require("./routes/queue");
const adminRoutes = require("./routes/admin");
const QueueUser = require("./models/QueueUser");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Middleware
app.use(cors());
app.use(express.json());

// Attach io to req
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Routes
app.use("/api/queue", queueRoutes);
app.use("/api/admin", adminRoutes);

// MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/fuelQueue")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// Socket.IO connection
io.on("connection", (socket) => {
    console.log("A user connected");
    socket.on("disconnect", () => console.log("A user disconnected"));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
