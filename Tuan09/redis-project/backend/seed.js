const mongoose = require('mongoose');
const Product = require('./models/Product');

const MONGODB_URL = 'mongodb://admin:password123@localhost:27017/product_db?authSource=admin';

// Sample data
const sampleProducts = [
  {
    id: 'prod_001',
    name: 'Laptop Pro 15',
    category: 'Electronics',
    price: 1299.99,
    stock: 50,
    description: 'High-performance laptop with Intel i9 processor',
    rating: 4.8
  },
  {
    id: 'prod_002',
    name: 'Wireless Headphones',
    category: 'Audio',
    price: 199.99,
    stock: 150,
    description: 'Noise-canceling wireless headphones',
    rating: 4.5
  },
  {
    id: 'prod_003',
    name: 'USB-C Cable',
    category: 'Accessories',
    price: 19.99,
    stock: 500,
    description: 'Fast charging USB-C cable 2m',
    rating: 4.2
  },
  {
    id: 'prod_004',
    name: 'Mechanical Keyboard',
    category: 'Peripherals',
    price: 129.99,
    stock: 100,
    description: 'RGB Mechanical Gaming Keyboard',
    rating: 4.6
  },
  {
    id: 'prod_005',
    name: '4K Webcam',
    category: 'Electronics',
    price: 89.99,
    stock: 75,
    description: 'Ultra HD 4K webcam for streaming',
    rating: 4.3
  },
  {
    id: 'prod_006',
    name: 'Phone Stand',
    category: 'Accessories',
    price: 14.99,
    stock: 300,
    description: 'Adjustable phone stand for desk',
    rating: 4.1
  },
  {
    id: 'prod_007',
    name: 'SSD 1TB',
    category: 'Storage',
    price: 99.99,
    stock: 80,
    description: 'NVMe SSD 1TB M.2 interface',
    rating: 4.7
  },
  {
    id: 'prod_008',
    name: 'Monitor 27" 4K',
    category: 'Displays',
    price: 399.99,
    stock: 30,
    description: '27 inch 4K UHD IPS Monitor',
    rating: 4.9
  },
  {
    id: 'prod_009',
    name: 'Mousepad XL',
    category: 'Accessories',
    price: 29.99,
    stock: 200,
    description: 'Extra large gaming mouse pad',
    rating: 4.4
  },
  {
    id: 'prod_010',
    name: 'Portable Charger',
    category: 'Power',
    price: 49.99,
    stock: 120,
    description: '20000mAh portable battery charger',
    rating: 4.5
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URL, {
      maxPoolSize: 50,
      socketTimeoutMS: 45000,
    });
    console.log('✓ MongoDB connected');

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Insert new products
    const inserted = await Product.insertMany(sampleProducts);
    console.log(`✅ Inserted ${inserted.length} products`);

    // Display inserted products
    console.log('\n📦 Products inserted:');
    inserted.forEach(p => {
      console.log(`  - ${p.name} (${p.category}) - $${p.price}`);
    });

    // Display indexes
    const indexes = await Product.collection.getIndexes();
    console.log('\n📇 Indexes created:', Object.keys(indexes));

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
