const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Trust proxy for Cloud Run
app.set('trust proxy', 1);

// Middleware
app.use(cors());
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: { error: 'Too many requests from this IP, please try again later.' }
});
app.use('/api', limiter);

// Basic health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'VoteWise AI Backend is running' });
});

// Root route for base URL
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Welcome to VoteWise AI API',
    endpoints: ['/api/journey', '/api/chat', '/api/timeline'],
    status: 'Live'
  });
});

// Routes
const journeyRoutes = require('./routes/journey.routes');
const chatRoutes = require('./routes/chat.routes');
const timelineRoutes = require('./routes/timeline.routes');

app.use('/api/journey', journeyRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/timeline', timelineRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
