const express = require('express');
const redis = require('redis');
const amqp = require('amqplib');
const mongoose = require('mongoose');
const Product = require('./models/Product');

const app = express();
app.use(express.json());

// Configs
const PORT = 3000;
const REDIS_HOST = 'localhost';
const REDIS_PORT = 6379;
const RABBITMQ_URL = 'amqp://admin:admin123@localhost:5672';
const MONGODB_URL = 'mongodb://admin:password123@localhost:27017/product_db?authSource=admin';

// Redis client
const redisClient = redis.createClient({
  host: REDIS_HOST,
  port: REDIS_PORT,
  socket: {
    reconnectStrategy: (retries) => Math.min(retries * 50, 500)
  }
});

// Connection states
let rabbitMQChannel = null;

// Connect to services
async function initializeConnections() {
  try {
    // Redis connect
    await redisClient.connect();
    console.log('✓ Redis connected');

    // MongoDB connect
    await mongoose.connect(MONGODB_URL, {
      maxPoolSize: 50,
      socketTimeoutMS: 45000,
    });
    console.log('✓ MongoDB connected');

    // RabbitMQ connect
    const connection = await amqp.connect(RABBITMQ_URL);
    rabbitMQChannel = await connection.createChannel();
    console.log('✓ RabbitMQ connected');
  } catch (error) {
    console.error('Connection error:', error);
    process.exit(1);
  }
}

// ========== MAIN ENDPOINT ==========
// High-load optimized endpoint
app.get('/api/data', async (req, res) => {
  try {
    const cacheKey = 'app:data';
    
    // Try Redis cache first (most fast)
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    // If not cached, generate data
    const data = {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date(),
      message: 'High-load test data',
      status: 'success'
    };

    // Cache for 10 seconds
    await redisClient.setEx(cacheKey, 10, JSON.stringify(data));

    // Send to RabbitMQ queue (async, non-blocking)
    if (rabbitMQChannel) {
      rabbitMQChannel.sendToQueue('requests', Buffer.from(JSON.stringify(data)), { persistent: false });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== PRODUCT ENDPOINTS ==========
// Get all products with caching
app.get('/api/products', async (req, res) => {
  try {
    const cacheKey = 'products:all';
    
    // Try Redis cache first
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.json({
        source: 'cache',
        count: JSON.parse(cached).length,
        data: JSON.parse(cached)
      });
    }

    // Fetch from MongoDB
    const products = await Product.find().lean().exec();
    
    // Cache for 30 seconds (product list doesn't change frequently)
    await redisClient.setEx(cacheKey, 30, JSON.stringify(products));

    // Send to RabbitMQ
    if (rabbitMQChannel) {
      rabbitMQChannel.sendToQueue('product_queries', Buffer.from(JSON.stringify({ 
        query: 'all',
        timestamp: new Date(),
        count: products.length
      })), { persistent: false });
    }

    res.json({
      source: 'database',
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const cacheKey = `product:${id}`;
    
    // Try Redis cache first
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.json({
        source: 'cache',
        data: JSON.parse(cached)
      });
    }

    // Fetch from MongoDB
    const product = await Product.findOne({ id }).lean().exec();
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Cache for 60 seconds (single product can be cached longer)
    await redisClient.setEx(cacheKey, 60, JSON.stringify(product));

    res.json({
      source: 'database',
      data: product
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get products by category
app.get('/api/products/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const cacheKey = `products:category:${category}`;
    
    // Try Redis cache first
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.json({
        source: 'cache',
        category,
        count: JSON.parse(cached).length,
        data: JSON.parse(cached)
      });
    }

    // Fetch from MongoDB
    const products = await Product.find({ category }).lean().exec();
    
    // Cache for 30 seconds
    await redisClient.setEx(cacheKey, 30, JSON.stringify(products));

    res.json({
      source: 'database',
      category,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Start server
async function start() {
  await initializeConnections();
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Backend running on http://localhost:${PORT}`);
    console.log(`📍 Endpoint: GET http://localhost:${PORT}/api/data`);
    console.log(`💚 Health: GET http://localhost:${PORT}/health`);
  });
}

start().catch(console.error);

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Shutting down...');
  await redisClient.quit();
  process.exit(0);
});
