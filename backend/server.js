const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const reportRoutes = require('./routes/reportRoutes');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

// Setup Socket.io
const io = socketIo(server, {
  cors: {
    origin: '*', // In development, allow all origins. Can be restricted to client URL in production.
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Middleware to attach socket.io to request object
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Standard Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Test Route
app.get('/', (req, res) => {
  res.json({ message: 'CrowdShield API is active and running' });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`Socket Connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`Socket Disconnected: ${socket.id}`);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
