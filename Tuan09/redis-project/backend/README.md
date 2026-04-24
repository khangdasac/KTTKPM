# High-Load Backend 🚀

Backend đơn giản cho test Postman, tối ưu cho **1000+ request/s**

## Công nghệ sử dụng
- **Node.js + Express** - Lightweight, high-throughput
- **Redis** - Caching layer (10s TTL)
- **RabbitMQ** - Async message queue
- **MongoDB** - Database (pooling 50 connections)

## Setup & Chạy

### 1. Cài đặt dependencies
```bash
cd backend
npm install
```

### 2. Đảm bảo Docker services chạy
```bash
# Từ thư mục redis-project
docker compose up -d
```

Verify:
```bash
docker compose ps
```

Kết quả:
```
CONTAINER ID   NAMES                       STATUS
xxxxx          redis-redis-project        Up
xxxxx          rabbitmq-redis-project     Up
xxxxx          mongodb-redis-project      Up
```

### 3. Chạy backend
```bash
cd backend
npm start
```

Output:
```
🚀 Backend running on http://localhost:3000
📍 Endpoint: GET http://localhost:3000/api/data
💚 Health: GET http://localhost:3000/health
```

## Test trên Postman

### Endpoint chính
```
GET http://localhost:3000/api/data
```

**Response:**
```json
{
  "id": "abc123xyz",
  "timestamp": "2026-04-24T10:30:45.123Z",
  "message": "High-load test data",
  "status": "success"
}
```

### Health Check
```
GET http://localhost:3000/health
```

## Tối ưu cho Load Cao (1000+ req/s)

1. **Caching**: Redis cache 10s - giảm database hits
2. **Connection Pooling**: 
   - MongoDB: max 50 connections
   - Redis: auto-reconnect strategy
3. **Async Operations**: RabbitMQ queue không block response
4. **Minimal Processing**: Endpoint logic đơn giản nhất
5. **Keep-Alive**: Express + Node.js tự động pool connections

## Load Test (optional)

### Dùng Apache Bench (ab)
```bash
# 1000 requests, 100 concurrent
ab -n 1000 -c 100 http://localhost:3000/api/data
```

### Dùng wrk (better)
```bash
wrk -t12 -c400 -d30s http://localhost:3000/api/data
```

### Dùng Postman Runner
1. Create request: `GET http://localhost:3000/api/data`
2. Postman → Runner → Set iterations=100, delay=10ms
3. Run Collection

## Troubleshooting

**Redis Connection Error:**
```bash
docker compose logs redis
```

**RabbitMQ Connection Error:**
```bash
docker compose logs rabbitmq
# Access UI: http://localhost:15672 (admin/admin123)
```

**MongoDB Connection Error:**
```bash
docker compose logs mongodb
```

**Port already in use:**
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

## Structure
```
backend/
├── package.json
├── server.js          (Main server + 1 endpoint)
└── .env               (Configuration)
```

**Đơn giản, dễ test, hiệu năng cao! 🎯**
