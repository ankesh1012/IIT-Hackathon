// server/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http'); 
const { Server } = require('socket.io');
const socketHandler = require('./socketHandler'); 


dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const connectDB = require('./config/db');
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/skills', require('./routes/skills'));
app.use('/api/sessions', require('./routes/sessions')); 
app.use('/api/services', require('./routes/services')); 
// --- ADD MESSAGE ROUTES ---
app.use('/api/messages', require('./routes/messages')); 


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

// --- SOCKET.IO INTEGRATION ---
const server = http.createServer(app); // Create HTTP server from Express app

const io = new Server(server, {
    cors: {
        // --- FIX: Allow both 3000 (React) and 5173 (Vite/Default) ---
        origin: ["http://localhost:3000", "http://localhost:5173"], 
        methods: ["GET", "POST"]
    }
});

socketHandler(io);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});