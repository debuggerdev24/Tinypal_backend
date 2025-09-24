// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

// MongoDB connection test
async function testMongoDBConnection() {
  try {
    await prisma.$connect();
    console.log('✅ MongoDB connected successfully');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    return false;
  }
}

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => res.send({ ok: true, message: 'TinyPal API Server' }));

// API Routes
const factsRouter = require('./routes/facts');
const flashcardsRouter = require('./routes/flashcards');
const categoriesRouter = require('./routes/categories');
const progressRouter = require('./routes/progress');
const doyouknowRouter = require('./routes/doyouknow');

app.use('/api/facts', factsRouter);
app.use('/api/flashcards', flashcardsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/progress', progressRouter);
app.use('/api/doyouknow', doyouknowRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ 
    error: err.message || 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 4000;

// Start server with MongoDB connection test
async function startServer() {
  const isConnected = await testMongoDBConnection();
  
  if (!isConnected) {
    console.error('🚨 Server startup failed: MongoDB connection required');
    process.exit(1);
  }
  
  const server = app.listen(PORT, () => {
    console.log(`🚀 TinyPal API Server listening on http://localhost:${PORT}`);
    console.log(`📱 Ready to serve mobile app requests`);
    console.log(`🗄️  Connected to MongoDB database`);
  });
  
  // Graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('🔄 SIGTERM received, shutting down gracefully');
    server.close(async () => {
      await prisma.$disconnect();
      console.log('✅ Server closed and MongoDB disconnected');
      process.exit(0);
    });
  });
  
  process.on('SIGINT', async () => {
    console.log('🔄 SIGINT received, shutting down gracefully');
    server.close(async () => {
      await prisma.$disconnect();
      console.log('✅ Server closed and MongoDB disconnected');
      process.exit(0);
    });
  });
}

startServer();
