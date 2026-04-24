# 🎯 Hướng Dẫn Test Postman - Chỉ 3 Bước

## Bước 1: Chạy Docker Services
```powershell
cd d:\HOCTAP\HK8\KienTruc\ThucHanh\KTTKPM\Tuan09\redis-project
docker compose up -d
```

Verify:
```powershell
docker compose ps
```

---

## Bước 2: Cài Dependencies & Chạy Backend
```powershell
cd backend
npm install
npm start
```

Chờ output:
```
✓ Redis connected
✓ MongoDB connected
✓ RabbitMQ connected
🚀 Backend running on http://localhost:3000
```

---

## Bước 3: Test trên Postman

### Import Collection
1. Postman → File → Import
2. Chọn file: `backend/Postman-Collection.json`

### Test Endpoint Chính

**Cách 1: Manual Request**
```
GET http://localhost:3000/api/data
```

**Cách 2: Dùng Postman Runner (Load Testing)**
1. Postman → Runner
2. Chọn collection: "High-Load Backend Test"
3. Set iterations: 100
4. Set delay: 10ms (1/100 của 1000ms)
5. Click Run

### Expected Response
```json
{
  "id": "abc123xyz",
  "timestamp": "2026-04-24T10:30:45.123Z",
  "message": "High-load test data",
  "status": "success"
}
```

---

## Load Test Mode (High Performance Check)

### Dùng Apache Bench (Windows)
```powershell
# Install nếu chưa có: choco install httpd
ab -n 1000 -c 100 http://localhost:3000/api/data
```

Output sẽ hiển thị:
- Requests per second (RPS)
- Response times
- Concurrency effectiveness

### Dùng Postman Runner - Extreme Load
1. Iterations: 1000
2. Delay: 0ms
3. Concurrent requests: max
4. Monitor RPS trong backend logs

---

## Tối Ưu Hóa Backend cho 1000+ req/s

✅ **Đã implement:**
- Redis Cache (10s TTL)
- Connection Pooling (MongoDB 50 connections)
- Async RabbitMQ queue
- Keep-alive connections
- Minimal endpoint logic

✅ **Có thể tăng thêm nếu cần:**
- Add compression middleware
- Add clustering (cluster module)
- Increase memory limits
- Enable HTTP/2

---

## Troubleshooting

**❌ Connection Refused**
```powershell
docker compose ps  # Check if all services running
docker compose logs redis  # Check specific service
```

**❌ Port 3000 already in use**
```powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**❌ npm install failed**
```powershell
del node_modules -r
del package-lock.json
npm install
```

---

## Commands Summary
```powershell
# Terminal 1: Docker services
docker compose up -d

# Terminal 2: Backend
cd backend && npm install && npm start

# Terminal 3: Test (using curl, PowerShell)
Invoke-WebRequest -Uri "http://localhost:3000/api/data" -Method Get
```

---

**Ready để test! Bắt đầu từ Bước 1 🚀**
