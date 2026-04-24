# 🚀 Setup Guide - Backend với MongoDB Products

## 📋 Các bước setup

### Step 1: Chắc chắn Docker services chạy
```powershell
docker compose ps
```

Output phải thấy 3 services running:
- ✅ redis
- ✅ rabbitmq  
- ✅ mongodb

### Step 2: Seed dữ liệu vào MongoDB
```powershell
cd backend
npm run seed
```

Output sẽ hiển thị:
```
✓ MongoDB connected
🗑️  Cleared existing products
✅ Inserted 10 products

📦 Products inserted:
  - Laptop Pro 15 (Electronics) - $1299.99
  - Wireless Headphones (Audio) - $199.99
  - USB-C Cable (Accessories) - $19.99
  ... (7 more products)

📇 Indexes created: ['_id_', 'id_1', 'name_1', ...]
```

### Step 3: Chạy backend server
```powershell
npm start
```

Output:
```
✓ Redis connected
✓ MongoDB connected
✓ RabbitMQ connected
🚀 Backend running on http://localhost:3000
📍 Endpoints:
  GET /api/data                      (Original test)
  GET /api/products                  (All products)
  GET /api/products/:id              (Single product)
  GET /api/products/category/:category (By category)
💚 Health: GET http://localhost:3000/health
```

---

## 🧪 Test trên Postman

### Import Collection
1. File → Import → `backend/Postman-Collection.json`

### Các Endpoints Available

#### 1. **Get All Products** ✅
```
GET http://localhost:3000/api/products
```

**Response:**
```json
{
  "source": "database",
  "count": 10,
  "data": [
    {
      "_id": "66abc123def456789...",
      "id": "prod_001",
      "name": "Laptop Pro 15",
      "category": "Electronics",
      "price": 1299.99,
      "stock": 50,
      "rating": 4.8,
      "createdAt": "2026-04-24T..."
    },
    ...
  ]
}
```

#### 2. **Get Product by ID** 
```
GET http://localhost:3000/api/products/prod_001
```

**Response:**
```json
{
  "source": "database",
  "data": {
    "id": "prod_001",
    "name": "Laptop Pro 15",
    "category": "Electronics",
    "price": 1299.99,
    "stock": 50,
    "description": "High-performance laptop with Intel i9 processor",
    "rating": 4.8
  }
}
```

#### 3. **Get Products by Category**
```
GET http://localhost:3000/api/products/category/Electronics
GET http://localhost:3000/api/products/category/Accessories
GET http://localhost:3000/api/products/category/Audio
```

**Response:**
```json
{
  "source": "database",
  "category": "Electronics",
  "count": 2,
  "data": [
    {
      "id": "prod_001",
      "name": "Laptop Pro 15",
      ...
    },
    {
      "id": "prod_005",
      "name": "4K Webcam",
      ...
    }
  ]
}
```

---

## ⚡ Load Test 1000 Requests

### PowerShell Script
```powershell
.\load-test.ps1 -totalRequests 1000 -concurrentRequests 100
```

Test sẽ hiển thị RPS, response times, etc.

### Apache Bench
```powershell
ab -n 1000 -c 100 http://localhost:3000/api/products
```

---

## 📦 Sample Products Database

10 products được seed vào MongoDB:

| ID | Name | Category | Price | Stock |
|----|----|----------|-------|-------|
| prod_001 | Laptop Pro 15 | Electronics | $1299.99 | 50 |
| prod_002 | Wireless Headphones | Audio | $199.99 | 150 |
| prod_003 | USB-C Cable | Accessories | $19.99 | 500 |
| prod_004 | Mechanical Keyboard | Peripherals | $129.99 | 100 |
| prod_005 | 4K Webcam | Electronics | $89.99 | 75 |
| prod_006 | Phone Stand | Accessories | $14.99 | 300 |
| prod_007 | SSD 1TB | Storage | $99.99 | 80 |
| prod_008 | Monitor 27" 4K | Displays | $399.99 | 30 |
| prod_009 | Mousepad XL | Accessories | $29.99 | 200 |
| prod_010 | Portable Charger | Power | $49.99 | 120 |

---

## 🔄 Caching Strategy

**Redis Cache TTL:**
- All Products: 30 seconds
- Single Product: 60 seconds  
- Category Products: 30 seconds

**Khi request:**
1. Check Redis cache (instant)
2. If miss → Query MongoDB
3. Cache result
4. Send to RabbitMQ queue (async logging)

---

## 📊 File Structure

```
backend/
├── package.json
├── server.js              (Main server + all endpoints)
├── seed.js                (Database seed script)
├── models/
│   └── Product.js         (Mongoose schema)
├── .env
├── .gitignore
├── load-test.ps1
├── Postman-Collection.json
├── README.md
└── SETUP.md              (This file)
```

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```powershell
docker compose logs mongodb
# Check if mongodb is running
docker compose restart mongodb
```

### Seed Error "Connection refused"
- Ensure MongoDB is running: `docker compose ps`
- Check credentials in seed.js match docker-compose.yaml

### Products not appearing
```powershell
# Re-run seed
npm run seed
```

### Redis Cache not working
```powershell
docker compose logs redis
# Clear Redis cache
docker exec redis-redis-project redis-cli FLUSHALL
```

---

## ✅ Verify Everything Works

```powershell
# Terminal 1: Check services
docker compose ps

# Terminal 2: Run backend
npm start

# Terminal 3: Test endpoint
Invoke-WebRequest -Uri "http://localhost:3000/api/products" -Method Get | ConvertTo-Json

# Should return products from MongoDB ✅
```

**Done! 🎯 Bạn đã có backend chạy từ MongoDB với high-load optimization.**
