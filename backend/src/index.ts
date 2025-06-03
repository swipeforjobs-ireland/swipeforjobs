import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import applicationRoutes from './routes/applications';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://swipeforjobs.ie', 'https://www.swipeforjobs.ie']
    : ['http://localhost:3000'],
  credentials: true
}));
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'SwipeForJobs API',
    version: '0.1.0'
  });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/applications', applicationRoutes);

// Test endpoint
app.get('/api/v1/test', (req, res) => {
  res.json({ 
    message: 'SwipeForJobs API is running!',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Welcome endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to SwipeForJobs API',
    version: '0.1.0',
    endpoints: {
      health: '/health',
      test: '/api/v1/test',
      auth: '/api/v1/auth',
      applications: '/api/v1/applications'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 SwipeForJobs API server running on port ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/v1/test`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
});

export default app;