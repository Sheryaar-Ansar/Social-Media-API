require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const db = require('./config/db');

// Routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const postRoute = require('./routes/postRoute');
const feedRoute = require('./routes/feedRoute');
const followRoute = require('./routes/followRoute');
const userRoute = require('./routes/userRoute');
const statsRoutes = require('./routes/statsRoutes');

// Middlewares
const responseHandler = require('./middlewares/responseMiddleware');
const errorHandler = require('./middlewares/errorMiddleware');

const app = express();

// Connect Database
db();

// Core Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(responseHandler);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/post', postRoute);
app.use('/api/feed', feedRoute);
app.use('/api/follow', followRoute);
app.use('/api/users', userRoute);
app.use('/api/stats', statsRoutes);

// Health check
app.get('/', (req, res) => {
  res.success({ app: "Social Media API" }, "API running fine.");
});

// 404 handler (for unknown routes)
app.use((req, res, next) => {
  const error = new Error("Something went wrong!");
  error.statusCode = 404;
  next(error); // pass to errorHandler
});

// Error Handler (last middleware)
app.use(errorHandler);


// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
